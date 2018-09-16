import { FlModule, Component, Injectable, Inject } from '../dist';

import { expect, assert } from 'chai';
import 'mocha';

let serviceCounter = 0;

describe('Test providers', () => {
  @Injectable()
  class Child1Service {
    constructor() {
      serviceCounter++;
      it('service should be instanciated once', () => {
        expect(serviceCounter).to.be.eql(1);
      })
    }
  }

  @Component()
  class Child1Component1 {
    constructor(@Inject(Child1Service) service: Child1Service) {
      it('service should be accessible in child 1 component', () => {
        expect(service).to.be.instanceOf(Child1Service);
      })
    }
  }

  @Component()
  class Child1Component2 {
    constructor(@Inject(Child1Service) service: Child1Service) {
      it('service should be accessible in child 2 component', () => {
        expect(service).to.be.instanceOf(Child1Service);
      })
    }}

  @Component()
  class Child2Component1 {}



  @FlModule({
    declarations: [ Child1Component1, Child1Component2 ],
    providers: [ Child1Service ]
  })
  class Child1 {}

  @FlModule({
    declarations: [ Child2Component1 ]
  })
  class Child2 {}


  @FlModule({
    imports: [ Child1, Child2 ]
  })
  class Parent {}

  const parent = new Parent();
  it('should create a parent class', () => {
    expect(parent).to.be.instanceOf(Parent);
  })

  it('service should not be contained in parent container', () => {
    assert.throw(
      function() { (parent as any).container.get(Child1Service) },
      Error,
      'No matching bindings found for serviceIdentifier: Child1Service'
    );
  })
})