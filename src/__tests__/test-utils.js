const fs = require('fs-extra');
const path = require('path');

const samplesRoot = path.resolve(__dirname, 'samples');

function getSample (fileName) {
  return fs.readFile(path.join(samplesRoot, fileName), 'utf8');
}

module.exports = {
  getSample
};
