const readData = require('../utils/readData');
const writeData = require('../utils/writeData');
const { parseId, parseBody } = require('../utils/parseHelpers');
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

module.exports = putHandler;