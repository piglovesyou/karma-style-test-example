const Path = require('path');
const assert = require('power-assert');
const {getDefaultStyle} = require('../tools');

const base = Path.join(__dirname.slice('/'.length), Path.basename(__filename, '.spec.js'));

describe("function-add", () => {
  beforeEach(() => {
    let el;
    while (el = document.body.firstChild) document.body.removeChild(el);
  });
  it("２つの引数の和を返すべし", () => {
    return Promise.all([
      promiseComputedStyleOf(createElement(base + '.spec.html', '.sample')),
      promiseComputedStyleOf(createElement(base + '.test.html', '.sample'))
    ]).then(([spec, test]) => {
      console.log(spec.getPropertyValue('padding'), test.getPropertyValue('padding'));
    })
  });
});

function promiseComputedStyleOf(element) {
  const doc = element.ownerDocument;
  const len = doc.querySelectorAll('link[rel="stylesheet"]').length;
  return new Promise((resolve, reject) => {
    let intervalTimer = setInterval(check, 40);
    let timeoutTimer = setTimeout(timeout, 1000);
    function check() {
      if (doc.styleSheets.length >= len) {
        clearTimer();
        const style = element.ownerDocument.defaultView.getComputedStyle(element);
        resolve(style);
      }
    }
    function timeout() {
      clearTimer();
      reject(new Error('Stylesheet load timeout'));
    }
    function clearTimer() {
      clearInterval(intervalTimer);
      clearTimeout(timeoutTimer);
    }
  });
}

function createElement(htmlPath, selector) {
  const sandbox = window.document.body.appendChild(document.createElement('iframe'));
  const doc = sandbox.contentDocument;
  doc.body.innerHTML = window.__html__[htmlPath];
  return doc.querySelector(selector);
}
