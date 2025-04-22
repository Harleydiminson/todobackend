const readData = require('../utils/readData');
const writeData = require('../utils/writeData');
const { parseId } = require('../utils/parseHelpers')
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

module.exports = deleteHandler;