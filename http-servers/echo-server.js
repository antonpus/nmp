const http = require('http');

http.createServer((req, res) => {

    const {method} = req;
    if (method !== 'POST') {
        res.statusCode = 405;
        res.end();
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        req.pipe(res);
    }
}).listen('8080', 'localhost');