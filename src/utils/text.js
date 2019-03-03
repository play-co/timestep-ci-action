/**
 * Removes empty lines at the start and at the end of the description block
 * while preserving markdown indentation on lines that are not empty.
 *
 * @param {string} text
 * @returns {string}
 */
function trim (text) {
  let lines = text.split('\n');

  function _trim () {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (!lines[i].trim()) {
        lines.pop();
      } else {
        break;
      }
    }
  }

  // Trim lines at the end
  _trim();

  lines = lines.reverse();

  // Trime lines at the beginning
  _trim();

  return lines.reverse().join('\n');
}

/**
 * Prepends every line with the specified number of spaces.
 *
 * @param {string} text
 * @param {number} width
 * @returns {string}
 */
function indent (text, width = 2) {
  let padding = ' '.repeat(width);
  return padding + text.split('\n').join('\n' + padding);
}

/**
 * Removes the specified number of spaces from every line.
 *
 * @param {string} text
 * @param {number} width
 * @returns {string}
 */
function outdent (text, width = 2) {
  let lines = text.split('\n')
    .map(line => {
      let availableSpaces = 0;

      for (let i = 0; i < line.length && i < width; i++) {
        if (line[i] === ' ') {
          availableSpaces++;
        } else {
          break;
        }
      }

      return line.substr(availableSpaces);
    });

  return lines.join('\n');
}

/**
 * Capitalizes every word in a string.
 *
 * @param {string} str
 * @returns {string}
 */
function capitalize (str) {
  return str.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
}

module.exports = {
  trim,
  indent,
  outdent,
  capitalize
};
