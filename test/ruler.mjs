import { assert } from 'chai';
import Ruler from '../lib/ruler.mjs';

describe('Ruler', function () {
  it('should replace rule (.at)', function () {
    const ruler = new Ruler();
    let res = 0;

    ruler.push('test', function foo() {
      res = 1;
    });
    ruler.at('test', function bar() {
      res = 2;
    });

    const rules = ruler.getRules('');

    assert.strictEqual(rules.length, 1);
    rules[0]();
    assert.strictEqual(res, 2);
  });

  it('should inject before/after rule', function () {
    const ruler = new Ruler();
    let res = 0;

    ruler.push('test', function foo() {
      res = 1;
    });
    ruler.before('test', 'before_test', function fooBefore() {
      res = -10;
    });
    ruler.after('test', 'after_test', function fooAfter() {
      res = 10;
    });

    const rules = ruler.getRules('');

    assert.strictEqual(rules.length, 3);
    rules[0]();
    assert.strictEqual(res, -10);
    rules[1]();
    assert.strictEqual(res, 1);
    rules[2]();
    assert.strictEqual(res, 10);
  });

  it('should enable/disable rule', function () {
    const ruler = new Ruler();
    let rules;

    ruler.push('test', function foo() {});
    ruler.push('test2', function bar() {});

    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 2);

    ruler.disable('test');
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 1);
    ruler.disable('test2');
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 0);

    ruler.enable('test');
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 1);
    ruler.enable('test2');
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 2);
  });

  it('should enable/disable multiple rule', function () {
    const ruler = new Ruler();
    let rules;

    ruler.push('test', function foo() {});
    ruler.push('test2', function bar() {});

    ruler.disable(['test', 'test2']);
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 0);
    ruler.enable(['test', 'test2']);
    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 2);
  });

  it('should enable rules by whitelist', function () {
    const ruler = new Ruler();

    ruler.push('test', function foo() {});
    ruler.push('test2', function bar() {});

    ruler.enableOnly('test');
    const rules = ruler.getRules('');
    assert.strictEqual(rules.length, 1);
  });

  it('should support multiple chains', function () {
    const ruler = new Ruler();
    let rules;

    ruler.push('test', function foo() {});
    ruler.push('test2', function bar() {}, { alt: ['alt1'] });
    ruler.push('test2', function bar() {}, { alt: ['alt1', 'alt2'] });

    rules = ruler.getRules('');
    assert.strictEqual(rules.length, 3);
    rules = ruler.getRules('alt1');
    assert.strictEqual(rules.length, 2);
    rules = ruler.getRules('alt2');
    assert.strictEqual(rules.length, 1);
  });

  it('should fail on invalid rule name', function () {
    const ruler = new Ruler();

    ruler.push('test', function foo() {});

    assert.throws(function () {
      ruler.at('invalid name', function bar() {});
    });
    assert.throws(function () {
      ruler.before('invalid name', function bar() {});
    });
    assert.throws(function () {
      ruler.after('invalid name', function bar() {});
    });
    assert.throws(function () {
      ruler.enable('invalid name');
    });
    assert.throws(function () {
      ruler.disable('invalid name');
    });
  });

  it('should not fail on invalid rule name in silent mode', function () {
    const ruler = new Ruler();

    ruler.push('test', function foo() {});

    assert.doesNotThrow(function () {
      ruler.enable('invalid name', true);
    });
    assert.doesNotThrow(function () {
      ruler.enableOnly('invalid name', true);
    });
    assert.doesNotThrow(function () {
      ruler.disable('invalid name', true);
    });
  });
});
