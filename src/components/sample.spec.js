const assert = require('power-assert');
const {StyleHelper} = require('../tools');

describe('sample component', () => {
  it('Style of .spec.html must be the same as one using external stylesheet', () => {
    const context = new StyleHelper({
      rootSelector: '.sample'
    });

    const expectedRootElement = context.render(`
    <div class="sample" style="
      border: 4px pink solid;
      padding: 8px;
      font-weight: bold;
      ">baa</div>
      `);

    const actualRootElement = context.render(`
    <link rel="stylesheet" href="base/src/components/sample.compiled.css" type="text/css" />
    <div class="sample">baa</div>
      `);

    return context.promiseStyles(expectedRootElement, actualRootElement)
      .then(([expected, actual]) => {
        assert.deepEqual(expected, actual);
        context.clean();
      });
  });
});

// When you use html2js and supposing there is "sample.spec.html":
// const Path = require('path');
// const base = Path.join(__dirname.slice('/'.length), Path.basename(__filename, '.spec.js'));
// window.__html__[base + '.spec.html']; // will return html string
