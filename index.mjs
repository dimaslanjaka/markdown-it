import MarkdownIt from "./lib/index.mjs";
export { MarkdownIt };

function markdownit(...args) {
  return new MarkdownIt(...args);
}

export default markdownit;

// CJS compatibility export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = markdownit;
  module.exports.default = markdownit;
  module.exports.MarkdownIt = MarkdownIt;
}
