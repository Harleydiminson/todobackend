const http = require('http');
const url = require('url');
const readData = require('./utils/readData');
const writeData = require('./utils/writeData');
const HOSTNAME = 'localhost';
const PORT = 3001;

// GetHandler
async function getHandler(req, res) {
    try {
        const data = await readData();
        res.statusCode = 200;
        res.end(data);
    } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to read data' }));
    }
}
// PostHandler
async function postHandler(req, res) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const parsedBody = JSON.parse(body);
            const jsonData = JSON.parse(await readData());
            const newData = { ...parsedBody, id: jsonData.length + 1 };
            console.log('newData', newData);
            jsonData.push(newData);
            await writeData(jsonData);
            res.statusCode = 201;
            res.end(JSON.stringify(newData));
        });
    } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to write data' }));
        console.error('Error writing file:', err);
    }
}
// PutHandler
async function putHandler(req, res) {
    const id = await parseId(req, res);
    let jsonFile = JSON.parse(await readData());
    const parsedBody = await parseBody(req);

    if (parsedBody.isCompleted === undefined) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'isCompleted field is required' }));
        return;
    }
    const task = jsonFile.find((task) => task.id === id);
    if (task) {
        task.isCompleted = parsedBody.isCompleted;
        jsonFile = [...jsonFile.filter((task) => task.id !== id), task];
        await writeData(jsonFile);
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Task updated', task }));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Task not found' }));
    }
}
// DeleteHandler
async function deleteHandler(req, res) {
    try {
        const id = await parseId(req, res);
        const jsonData = JSON.parse(await readData());
        await writeData(jsonData.filter(item => item.id !== id));
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Data deleted successfully' }));

    } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
    };
}


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

// ParseId
async function parseId(req, res) {
    const parsedUrl = url.parse(req.url, true);
    console.log('parsedUrl', parsedUrl);
    const id = parseInt(parsedUrl.pathname.split('/')[2]);
    console.log('id', id);
    if (isNaN(id)) {
        throw new Error('Invalid ID');
    }
    return id;
}

// Parsebody
async function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody);
            } catch (err) {
                reject(err);
            }
        });
    });
}

