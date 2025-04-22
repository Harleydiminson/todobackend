const fs = require('fs').promises;
const FILE = 'data.json';

async function writeData(jsonData) {
    try {
        await fs.writeFile(FILE, JSON.stringify(jsonData, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing file:', err);
    }
};

module.exports = writeData;