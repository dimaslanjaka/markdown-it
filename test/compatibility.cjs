const markdownit = require('../dist/markdown-it.cjs');

const md = markdownit();
const result = md.render('# markdown-it rulezz!');
console.log(result);
