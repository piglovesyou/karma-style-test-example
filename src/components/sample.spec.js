const Path = require('path');
const assert = require('power-assert');
const helper = require('../tools').get();;

// When you use html2js:
// const base = Path.join(__dirname.slice('/'.length), Path.basename(__filename, '.spec.js'));
// window.__html__[base + '.spec.html'];

describe('sample component', () => {
  beforeEach(() => helper.clean());
  it('Style of .spec.html must be the same as one using external stylesheet', () => {
    return Promise.all([
      helper.promiseStyleWithHTML(`

<div class="sample" style="
  border: 4px pink solid;
  padding: 8px;
  font-weight: bold;
  ">baa</div>

        `, '.sample', {viewportWidth: 600}),
      helper.promiseStyleWithHTML(`

<link rel="stylesheet" href="base/src/components/sample.compiled.css" type="text/css" />
<div class="sample">baa</div>

        `, '.sample', {viewportWidth: 600})
    ]).then(([spec, test]) => {
      assert.deepEqual(spec, test);
    });

    // API design:
    // const Helper = require('style-helper');
    // const context = new Helper({
    //   rootSelector: 'div',
    //   viewportWidth: 600,
    //   viewportHeight: 400,
    // });
    // const expectedRootElement = context.render(`
    // <div class="sample" style="
    //   border: 4px pink solid;
    //   padding: 8px;
    //   font-weight: bold;
    //   ">baa</div>
    //   `);
    // const actualRootElement = context.render(`
    // <link rel="stylesheet" href="base/src/components/sample.compiled.css" type="text/css" />
    // <div class="sample">baa</div>
    //   `);
    // context.promiseStyles(expectedElement, actualElement)
    //   .then(([expected, actual]) => {
    //     assert.deepEqual(expected, actual);
    //   });
  });
});
