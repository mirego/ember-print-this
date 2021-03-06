import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

moduleForComponent('print-this', 'Integration | Component | print this', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{print-this}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#print-this}}
      template block text
    {{/print-this}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('it auto prints the block template if specified', function(assert) {
  const jqueryStub = sinon.stub();
  this.set('jQueryStub', jqueryStub);
  const printThisSpy = sinon.spy();

  jqueryStub.withArgs('.content__printThis').returns({ printThis: printThisSpy });

  this.render(hbs`
    {{#print-this autoPrint=true _jQuery=jQueryStub}}
      <p>Some block stuff</p>
    {{/print-this}}
  `);

  assert.equal(printThisSpy.callCount, 1, 'Print this spy is called once');
});

test('it auto prints with the custom selector', function(assert) {
  const jqueryStub = sinon.stub();
  this.set('jQueryStub', jqueryStub);
  const printSelector = '.customClass';
  this.set('printSelector', printSelector);

  const printThisSpy = sinon.spy();

  jqueryStub.withArgs(printSelector).returns({ printThis: printThisSpy });

  this.render(hbs`
    {{#print-this autoPrint=true printSelector=printSelector _jQuery=jQueryStub}}
      <p>Some block stuff</p>
    {{/print-this}}
  `);

  assert.equal(printThisSpy.callCount, 1, 'Print this spy is called once');
});

test('it does not auto print if not specified', function(assert) {
  const jqueryStub = sinon.stub();
  this.set('jQueryStub', jqueryStub);
  const printThisSpy = sinon.spy();

  jqueryStub.returns({ printThis: printThisSpy });

  this.render(hbs`
    {{#print-this _jQuery=jQueryStub}}
      <p>Some block stuff</p>
    {{/print-this}}
  `);

  assert.equal(printThisSpy.callCount, 0, 'Print this spy is never called');
});

test('it can call print from yielded action', function(assert) {
  const jqueryStub = sinon.stub();
  this.set('jQueryStub', jqueryStub);
  const printThisSpy = sinon.spy();

  jqueryStub.withArgs('.content__printThis').returns({ printThis: printThisSpy });

  this.render(hbs`
    {{#print-this _jQuery=jQueryStub as |doPrint|}}
      <p>Some block stuff</p>
      <button onclick={{doPrint}}>Heyo</button>
    {{/print-this}}
  `);

  this.$('button').click();
  assert.equal(printThisSpy.callCount, 1, 'Print this spy is called once');
});

test('it calls printThis with options if specified', function(assert) {
  const jqueryStub = sinon.stub();
  this.set('jQueryStub', jqueryStub);
  const options = { printDelay: 500 }
  this.set('options', options);
  const printThisSpy = sinon.spy();

  jqueryStub.withArgs('.content__printThis').returns({ printThis: printThisSpy });

  this.render(hbs`
    {{#print-this options=options autoPrint=true _jQuery=jQueryStub}}
      <p>Some block stuff</p>
    {{/print-this}}
  `);

  assert.equal(printThisSpy.callCount, 1, 'Print this spy is called once');
  assert.ok(printThisSpy.calledWith(options), 'Print this spy called with options hash');
});
