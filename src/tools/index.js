class StyleHelper {
  constructor() {
    this.frames = [];
  }
  promiseStyleWithHTML(html, selector) {
    const element = this.createElement(html, selector);
    return this.promiseStyle(element);
  }
  promiseStyle(element) {
    const doc = element.ownerDocument;
    return this.waitForCSSLoad(doc)
      .then(() => {
        return doc.defaultView.getComputedStyle(element);
      });
  }
  waitForCSSLoad(element) {
    const doc = element.ownerDocument || element.defaultView ? element : null;
    if (!doc) throw new Error('Invalid element was passed');
    const len = doc.querySelectorAll('link[rel="stylesheet"]').length;
    return new Promise((resolve, reject) => {
      let intervalTimer = setInterval(check, 40);
      let timeoutTimer = setTimeout(timeout, 1000);
      if (check()) return;
      function check() {
        if (doc.styleSheets.length >= len) {
          clearTimer();
          resolve();
          return true;
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
  createElement(html, selector) {
    const frame = document.createElement('iframe');
    this.frames.push(frame);
    window.document.body.appendChild(frame);
    const doc = frame.contentDocument;
    doc.body.innerHTML = html;
    return doc.querySelector(selector);
  }
  clean() {
    for (let f of this.frames) {
      f.parentNode.removeChild(f);
    }
  }
}

module.exports.get = () => new StyleHelper();
