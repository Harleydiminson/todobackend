const http = require('http');
const getHandler = require('./handlers/getHandler');
const postHandler = require('./handlers/postHandler');
const putHandler = require('./handlers/putHandler');
const deleteHandler = require('./handlers/deleteHandler');
const HOSTNAME = 'localhost';
const PORT = 3001;


//Server node.js
const server = http.createServer((req, res) => {
    console.log(`Request received, method: ${req.method}, url: ${req.url}`);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }
    switch (true) {
        case req.method === 'GET' && req.url === '/task/':
            getHandler(req, res);
            break;
        case req.method === 'POST' && req.url === '/task/':
            postHandler(req, res);
            break;
        case req.method === 'PUT' && req.url.startsWith('/task/'):
            putHandler(req, res);
            break;
        case req.method === 'DELETE' && req.url.startsWith('/task/'):
            deleteHandler(req, res);
            break;
        default:
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not Found' }));
    }
});
server.listen(PORT, HOSTNAME, (error) => {
    error ? console.log(error) : console.log(`Server running on port: http://${HOSTNAME}:${PORT}`);
});