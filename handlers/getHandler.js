const readData = require('../utils/readData');
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

module.exports = getHandler;