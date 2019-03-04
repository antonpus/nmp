#!/usr/bin/env node

'use strict';

const program = require('commander');
const through2 = require('through2');
const fs = require('fs');
const csv = require('csv-parser');
const split = require('split2');
const util = require('util');
const path = require('path');
const stream = require('stream');

const supportedActions = {
    'reverse': reverse,
    'transform': transform,
    'outputFile': outputFile,
    'convertFromFile': convertFromFile,
    'convertToFile': convertToFile,
    'bundleCss': bundleCss
};

function help() {
    console.log('-a, --action <action>, an action to be performed');
    console.log('-f, --file [file], a file required for particular action');
    console.log('-h, --help, usage manual');
    console.log('available actions:');
    console.log('-a reverse');
    console.log('-a transform');
    console.log('-a outputFile -f <filePath>');
    console.log('-a convertFromFile -f <filePath>');
    console.log('-a convertToFile -f <filePath>');
    console.log('-a bundleCss -p <dirPath>');
}

function transformInput(transformFunc) {
    const withPrefix = () => through2((data, enc, next) => {
        next(null, Buffer.from(`result> ${data.toString().trim()}`));
    });

    const withSuffix = () => through2((data, enc, next) => {
        next(null, Buffer.from(`${data.toString().trim()}\ninput> `));
    });

    const applyTransformation = () => through2((data, enc, next) => {
        next(null, Buffer.from(transformFunc(data.toString())));
    });

    process.stdout.write('input> ');
    process.stdin
        .pipe(applyTransformation())
        .pipe(withPrefix())
        .pipe(withSuffix())
        .pipe(process.stdout);
}

function reverse() {
    transformInput(str => str.split('').reverse().join(''));
}

function transform() {
    transformInput(str => str.toUpperCase());
}

function toJSON() {
    const result = [];
    return through2.obj((data, enc, next) => {
        result.push(data);
        next(null, null);
    }, function (end) {
        this.push(JSON.stringify(result));
        end();
    });
}

function outputFile(filePath) {
    if (!filePath) {
        printUsageError();
        return;
    }

    const appendNewLine = () => through2((data, enc, next) => {
        next(null, Buffer.from(`${data.toString()}\n`));
    });

    fs.createReadStream(filePath)
        .on('error', err => console.log(`ouputFile action error: ${err}`))
        .pipe(split())
        .pipe(appendNewLine())
        .pipe(process.stdout);
}

function convertFromFile(filePath) {
    if (!filePath) {
        printUsageError();
        return;
    }

    fs.createReadStream(filePath)
        .on('error', err => console.log(`convertFromFile action error: ${err}`))
        .pipe(csv())
        .pipe(toJSON())
        .pipe(process.stdout);
}

function convertToFile(filePath) {
    if (!filePath) {
        printUsageError();
        return;
    }

    fs.createReadStream(filePath)
        .on('error', err => console.log(`convertToFile action error: ${err}`))
        .pipe(csv())
        .pipe(toJSON())
        .pipe(fs.createWriteStream(filePath.replace('.csv', '.json')));

}

function bundleCss(dirPath) {
    if (!dirPath) {
        printUsageError();
        return;
    }

    if (!fs.existsSync(dirPath)) {
        console.log(`No dir exists ${dirPath}`);
        return;
    }

    const cssStream = stream.Readable();
    cssStream._read = function () {
    }

    const filterCssFiles = fileNames => fileNames.filter(name => path.extname(name) === '.css');
    const filterBundleCss = fileNames => fileNames.filter(name => name !== 'bundle.css' && name !== 'default.css');
    const addDefaultCss = fileNames => {
        fileNames.push('default.css');
        return fileNames;
    }


    const getFileContentAndPushIntoStream = fileName => fs.createReadStream(path.join(dirPath, fileName))
        .on('data', data => cssStream.push(data));

    const pushFilesToStream = fileNames => fileNames.forEach(name => getFileContentAndPushIntoStream(name));

    const readdirAsync = util.promisify(fs.readdir);
    const readCssDir = () => readdirAsync(dirPath)
        .then(filterBundleCss)
        .then(filterCssFiles)
        .then(addDefaultCss)
        .then(pushFilesToStream);

    const transformCss = () => through2((data, enc, next) => next(null, Buffer.from(`${data}\n`)));
    const toBundleCss = () => fs.createWriteStream(path.join(dirPath, 'bundle.css'));

    cssStream
        .pipe(transformCss())
        .pipe(toBundleCss());

    readCssDir();
}

function performAction(program, args) {
    const action = supportedActions[program.action];
    if (action) {
        action(program.file ? program.file : program.path);
    } else {
        printUsageError();
    }
}

function printUsageError() {
    console.error('Invalid usage, please use --help to get usage manual');
}

function isHelpNeeded(args) {
    const noArgs = !args.length;
    const helpIsFirstArg = args[0] === '-h' || args[0] === '--help';
    return noArgs || helpIsFirstArg;
}

function isProgramUsageNotAllowed(args) {
    return args[0] !== '-a' && args[0] !== '--action';
}

function getProgramArgs() {
    return process.argv.slice(2);
}

function parseProgram() {
    return program
        .option('-a, --action <required>', 'An action to be performed')
        .option('-f, --file [optional]', 'A file required for particular action')
        .option('-p, --path [optional]', 'A directory path required for particular action')
        .option('-h, --help', 'usage manual')
        .parse(process.argv);
}

function main() {
    const program = parseProgram();
    const args = getProgramArgs();
    if (isHelpNeeded(args)) {
        help();
    } else if (isProgramUsageNotAllowed(args)) {
        printUsageError();
    } else {
        performAction(program, args);
    }
}

main();
