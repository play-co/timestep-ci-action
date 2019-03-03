const { trim } = require('./utils/text');

const blockExtractRE = /^<!-- (.*?) -->\n- \[([ x])\] ((\*\*)?.*?(\*\*)?)(:(\s?\n)?([^<#]*)|)$/img;
const requiredBlocks = [
  'features',
  'refactoring',
  'bug fixes',
  'documentation',
  'code style',
  'user experience',
  'tests',
  'chores',
  'no breaking changes',
  'breaking changes'
];

class FeatureBlock {
  constructor (name, description, active) {
    this.name = name;
    this.description = description;
    this.active = active;
  }
}

class PullRequestBody {
  constructor (text) {
    this.text = text;
    this.blocks = {};

    this.parse();
  }

  parse () {
    const foundBlocks = [];

    while (true) {
      const matches = blockExtractRE.exec(this.text);

      if (!matches) {
        break;
      }

      const name = matches[1];
      const description = trim(matches[8] || '');
      const active = matches[2] !== ' ';

      if (this.blocks[name]) {
        throw new Error('Duplicate block: ' + name);
      }

      if (requiredBlocks.indexOf(name) === -1) {
        throw new Error('Unkown block: ' + name);
      }

      this.blocks[name] = new FeatureBlock(name, description, active);
      foundBlocks.push(name);
    }

    if (foundBlocks.length !== requiredBlocks.length) {
      const missingBlocks = requiredBlocks
        .filter(name => foundBlocks.indexOf(name) !== -1);
      throw new Error(`Missing blocks: [${missingBlocks.join(', ')}]`);
    }
  }

  getBlock (name) {
    if (!this.blocks[name]) {
      throw new Error('Invalid block name: ' + name);
    }

    return this.blocks[name];
  }
}

module.exports = PullRequestBody;
