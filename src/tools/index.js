class StyleHelper {
  constructor(options) {
    this.options = Object.assign({
      rootSelector: 'div',
      viewportWidth: undefined,
      viewportHeight: undefined,
    }, options);
    this.frames = [];
  }
  render(html) {
    const {rootSelector, viewportWidth, viewportHeight} = this.options;
    const frame = document.createElement('iframe');
    this.frames.push(frame);
    if (typeof viewportWidth === 'number') {
      frame.style.width = viewportWidth + 'px';
    }
    if (typeof viewportHeight === 'number') {
      frame.style.height = viewportHeight + 'px';
    }
    window.document.body.appendChild(frame);
    const doc = frame.contentDocument;
    doc.body.innerHTML = html;
    return doc.querySelector(rootSelector);
  }
  promiseStyles(...elements) {
    return Promise.all(elements.map(waitForCSSLoad))
      .then(elements => elements.map(computedStyleOf));
  }
  clean() {
    const {frames} = this;
    this.frames = [];
    for (let f of frames) {
      f.parentNode.removeChild(f);
    }
  }
}

module.exports.StyleHelper = StyleHelper;

function computedStyleOf(element) {
  return element.ownerDocument.defaultView.getComputedStyle(element);
}

function waitForCSSLoad(element) {
  const doc = element.ownerDocument || (element.defaultView ? element : null);
  if (!doc) throw new Error('Invalid element was passed');
  const len = doc.querySelectorAll('link[rel="stylesheet"]').length;
  return new Promise((resolve, reject) => {
    let intervalTimer = setInterval(check, 40);
    let timeoutTimer = setTimeout(timeout, 1000);
    if (check()) return;
    function check() {
      if (doc.styleSheets.length >= len) {
        clearTimer();
        resolve(element);
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
