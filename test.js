// Run: node test.js
const assert = require('assert');
const { getSortKey, compareTabs } = require('./sortkey.js');

assert.deepStrictEqual(getSortKey('https://docs.google.com/document/d/1'), ['google.com', 'docs', 'document']);
assert.deepStrictEqual(getSortKey('https://www.google.com/search?q=x'), ['google.com', '', 'search']);
assert.deepStrictEqual(getSortKey('https://news.bbc.co.uk/sport'), ['bbc.co.uk', 'news', 'sport']);
assert.deepStrictEqual(getSortKey('http://127.0.0.1:3000/'), ['127.0.0.1', '', '']);
assert.strictEqual(getSortKey('chrome://extensions'), null);

const urls = [
  'chrome://newtab/',
  'https://docs.google.com/spreadsheets/d/a',
  'https://github.com/anuj3918/tabtidy',
  'https://mail.google.com/mail/u/0/',
  'https://docs.google.com/document/d/b',
  'https://www.google.com/search?q=x',
  'https://docs.google.com/spreadsheets/d/c',
  'https://docs.google.com/document/d/d',
];
const sorted = urls.map(url => ({ url })).sort(compareTabs).map(t => t.url);
assert.deepStrictEqual(sorted, [
  'https://github.com/anuj3918/tabtidy',
  'https://www.google.com/search?q=x',
  'https://docs.google.com/document/d/b',
  'https://docs.google.com/document/d/d',
  'https://docs.google.com/spreadsheets/d/a',
  'https://docs.google.com/spreadsheets/d/c',
  'https://mail.google.com/mail/u/0/',
  'chrome://newtab/',
]);

console.log('ok');
