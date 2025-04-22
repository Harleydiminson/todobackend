const fs = require('fs').promises;
const FILE = 'data.json';

async function readData() {
  try {
    return await fs.readFile(FILE, { encoding: 'utf8', flag: 'r' });
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}

module.exports = readData;