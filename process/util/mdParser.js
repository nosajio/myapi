var titleCase = require('to-title-case');
var _ = require('lodash');


/**!
 * Just feed this method frontmatter headed markdown and it spits it out as a
 * good ol' JS object
 * @param {String} filename - The raw filename of the markdown file
 * @param {String} filebody - The raw body of a markdown file
 */
function markdownParser (filename, filebody) {
  var proto = markdownParser.prototype;
  console.log( proto.filenameExtract(filename) );
}


markdownParser.prototype.filenameRegex = /(.*)-(\d{4}-\d{1,2}-\d{1,2})$/;


/**!
 * Check whether this filename is valid or not
 * @param {String} filename
 * @returns {Bool}
 */
markdownParser.prototype.test = function (filename) {
  var proto = markdownParser.prototype;
  filename = filename.replace('.md', '');

  if ( filename.match(proto.filenameRegex) ) {
    return true;
  }
  return false;
};


/**!
 * For stripping the slug and date out of the filename
 * @param {String} filename
 * @returns {Object <title: {String}, slug: {String}, date: {Date}> | false} will return object
 *          if the filename is valid, otherwise returns `false`
 */
markdownParser.prototype.filenameExtract = function (filename) {
  if (! _.isString(filename)) {
    console.warn('filename must be a string');
    return false;
  }

  var proto = markdownParser.prototype;
  var date, slug, title;

  if (! proto.test(filename)) {
    console.log(`Cant parse ${filename}`);
    return false;
  }

  filename = filename.replace('.md', '');
  var parsed = filename.match( proto.filenameRegex );

  // Convert title into more friendly string
  slug = parsed[1];
  title = parsed[1].replace(/-/gi, ' ');
  title = titleCase(title);

  // Convert date from string to a js date
  date = new Date(parsed[2]);

  return {
    slug: slug,
    date: date,
    title: title
  };
};

module.exports = {
  test: markdownParser.prototype.test,
  parse: markdownParser
};
