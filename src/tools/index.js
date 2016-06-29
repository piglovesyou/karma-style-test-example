// const tags = require('html-tags');

// defaultStyles[tagName][cssProp] = cssValue;
const defaultStyles = {};

class DefaultStyle {
  constructor(tagName) {
    this.tagName = tagName;
    this.frame = document.createElement('iframe');
    document.body.appendChild(this.frame);
    const target = document.createElement(this.tagName);
    this.frame.contentDocument.body.appendChild(target);
    const computed = this.frame.contentWindow.getComputedStyle(target);
    this.result = Object.assign({}, computed);
  }
  get() {
    return this.result;
  }
  dispose() {
    document.body.removeChild(this.frame);
  }
}

function getDefaultStyle(tagName) {
  if (defaultStyles[tagName]) return defaultStyles[tagName];
  const ds = new DefaultStyle(tagName);
  defaultStyles[tagName] = ds.get();
  ds.dispose();
  return defaultStyles[tagName];
}

module.exports = {getDefaultStyle};
