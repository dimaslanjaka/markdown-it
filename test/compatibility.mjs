import markdownit from '../dist/markdown-it.mjs';

const md = markdownit();
const result = md.render('# markdown-it rulezz!');
console.log(result);
