const Path = require('path');
const assert = require('power-assert');
const {getDefaultStyle} = require('../tools');

let windows = {};

describe("function-add", () => {
  beforeEach(() => {
    const base = Path.join(__dirname.slice('/'.length), Path.basename(__filename, '.spec.js'));
    for (let name of ['spec', 'test']) {
      document.body.appendChild(document.createElement('h2')).textContent = name[0].toUpperCase() + name.slice(1);
      const frame = document.body.appendChild(document.createElement('iframe'));
      frame.contentDocument.body.innerHTML = window.__html__[base + '.' + name + '.html'];
      windows[name] = frame.contentWindow;
    }
  });
  it("２つの引数の和を返すべし", () => {
    assert.deepEqual(
      renderedStyle('spec', '.sample'),
      renderedStyle('test', '.sample'));
  });
});

function $(selector) {
  return document.querySelector(selector);
}

function renderedStyle(name, selector) {
  const element = windows[name].document.querySelector(selector);
  return Object.assign({}, windows[name].getComputedStyle(element), element.style)
}
