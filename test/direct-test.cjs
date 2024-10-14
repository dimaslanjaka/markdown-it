const { default: markdownit } = require('../dist/markdown-it.cjs');
const markdownit2 = require('../dist/index.cjs');
const fs = require('node:fs');

const md = new markdownit({
  html: true,
  langPrefix: '',
  typographer: true,
  linkify: true
});
const md2 = new markdownit2({
  html: true,
  langPrefix: '',
  typographer: true,
  linkify: true
});
const result1 = md.renderInline('__markdown-it__ rulezz!');
const result2 = md2.render(fs.readFileSync('test/fixtures/markdown-it/tables.txt', 'utf-8'), {});
console.log(result1);
console.log(result2);
