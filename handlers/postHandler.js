const readData = require('../utils/readData');
const writeData = require('../utils/writeData');
const { parseBody } = require('../utils/parseHelpers');
// PostHandler
async function postHandler(req, res) {
    try {
        const parsedBody = await parseBody(req);
        const jsonData = JSON.parse(await readData());
        const newData = { ...parsedBody, id: jsonData.length + 1 };
        console.log('newData', newData);
        jsonData.push(newData);
        await writeData(jsonData);
        res.statusCode = 201;
        res.end(JSON.stringify(newData));
    }
    catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to write data' }));
        console.error('Error writing file:', err);
    }
}

module.exports = postHandler;