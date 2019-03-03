const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { capitalize } = require('./utils/text');

const releaseTpl = fs.readFileSync(
  path.resolve(__dirname, './templates/release.hbs')
).toString();

const compiledTemplate = handlebars.compile(releaseTpl, {
  noEscape: true
});

const renderBlocks = [
  'breaking changes',
  'features',
  'refactoring',
  'bug fixes',
  'user experience',
  'documentation',
  'tests'
];

class ChangelogGenerator {
  constructor () {
    this.pullRequests = [];
    this.features = {
      'breaking changes': [],
      'features': [],
      'refactoring': [],
      'bug fixes': [],
      'user experience': [],
      'documentation': [],
      'code style': [],
      'tests': [],
      'chores': [],
      'no breaking changes': []
    };
  }

  addPullRequest (id, body) {
    this.pullRequests.push({ id, body });
  }

  compile () {
    for (let pr of this.pullRequests) {
      for (let feature in this.features) {
        const block = pr.body.getBlock(feature);

        if (!block.active) {
          continue;
        }

        this.features[feature].push({
          id: pr.id,
          description: block.description
        });
      }
    }
  }

  render (opts = {}) {
    if (!opts.version) {
      throw new Error('No version information');
    }

    if (!opts.repositoryURL) {
      throw new Error('No repository URL');
    }

    this.compile();

    const blocks = [];

    for (let name of renderBlocks) {
      if (!this.features[name].length) {
        continue;
      }

      const parts = [];

      for (let part of this.features[name]) {
        parts.push({
          pr: {
            id: part.id,
            link: this.getURL(opts.repositoryURL, part.id)
          },
          description: part.description
        });
      }

      blocks.push({
        title: capitalize(name),
        parts
      });
    }

    const tplData = {
      blocks,
      version: opts.version,

      // @FIXME There's probably a better way of formatting date
      date: (new Date()).toISOString().split('T')[0]
    };

    return compiledTemplate(tplData);
  }

  getURL (repository, id) {
    // Should be similar to this:
    // https://github.com/gameclosure/timestep-instant/pull/10
    return `${repository}/pull/${id}`;
  }
}

module.exports = ChangelogGenerator;
