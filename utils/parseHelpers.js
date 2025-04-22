const url = require('url');

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

module.exports = { parseId, parseBody };