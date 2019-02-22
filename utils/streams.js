#!/usr/bin/env node

'use strict';

const program = require('commander');
const through2 = require('through2');
const fs = require('fs');
const csv = require('csv-parser');
const split = require('split2');

const supportedActions = {
    'reverse': reverse,
    'transform': transform,
    'outputFile': outputFile,
    'convertFromFile': convertFromFile,
    'convertToFile': convertToFile
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
    }, function (next) {
        this.push(JSON.stringify(result));
        next();
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

function performAction(program, args) {
    const action = supportedActions[program.action];
    if (action) {
        action(program.file);
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
