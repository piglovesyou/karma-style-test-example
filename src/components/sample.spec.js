const Path = require('path');
const assert = require('power-assert');
const helper = require('../tools').get();;

const base = Path.join(__dirname.slice('/'.length), Path.basename(__filename, '.spec.js'));

describe("function-add", () => {
  beforeEach(() => helper.clean());
  it("２つの引数の和を返すべし", () => {
    return Promise.all([
      helper.promiseStyleWithHTML(window.__html__[base + '.spec.html'], '.sample'),
      helper.promiseStyleWithHTML(`
<link rel="stylesheet" href="base/src/components/sample.compiled.css" type="text/css" />
<div class="sample">baa</div>
<script src="base/src/components/sample.js"></script>
        `, '.sample')
    ]).then(([spec, test]) => {
      assert(Object.keys(spec).length, Object.keys(test).length);
      for (let k of Object.keys(spec)) {
        assert(spec[k] === test[k]);
      }
    })
  });
});
