const http = require('http');
const fs = require('fs');
const through2 = require('through2');


const replacePlaceholder = () => through2((data, enc, next) => {
    next(null, Buffer.from(data.toString().replace('{message}', 'Hello World')));
});

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.createReadStream('./resources/index.html')
        .pipe(replacePlaceholder())
        .pipe(res);
}).listen('8080', 'localhost');