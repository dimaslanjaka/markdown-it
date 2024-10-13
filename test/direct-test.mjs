import { fileURLToPath } from 'node:url';
import markdownit from '../index.mjs';
import fs from 'node:fs';

const md = markdownit({
  html: true,
  langPrefix: '',
  typographer: true,
  linkify: true
});
const result1 = md.renderInline('__markdown-it__ rulezz!');
const result2 = md.render(
  fs.readFileSync(fileURLToPath(new URL('fixtures/markdown-it/tables.txt', import.meta.url)), 'utf-8'),
  {}
);
console.log(result1);
console.log(result2);
