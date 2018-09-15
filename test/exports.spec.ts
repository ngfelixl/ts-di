import { FlModule, Component, Injectable, Inject } from '../src';

import { expect } from 'chai';
import 'mocha';

let serviceCounter = 0;

describe('Test exports', () => {
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
      });
    }
  }

  @Component()
  class Child1Component2 {}

  @Component()
  class Child2Component1 {
    constructor(@Inject(Child1Service) service: Child1Service) {
      it('service should be accessible in child 2 compoent', () => {
        expect(service).to.be.instanceOf(Child1Service);
      })
    }}

  @Component()
  class ParentComponent {
    constructor(@Inject(Child1Service) service: Child1Service) {
      it('service should be accessible in parent compoent', () => {
        expect(service).to.be.instanceOf(Child1Service);
      })
    }
  }


  @FlModule({
    declarations: [ Child1Component1, Child1Component2 ],
    exports: [ Child1Service ]
  })
  class Child1 {
    constructor() {}
  }

  @FlModule({
    declarations: [ Child2Component1 ]
  })
  class Child2 {}


  @FlModule({
    imports: [ Child1, Child2 ],
    declarations: [ ParentComponent ]
  })
  class Parent {}

  const parent = new Parent();
  (parent as any).container.get(ParentComponent);
  it('should create a parent class', () => {
    expect(parent).to.be.instanceOf(Parent);
  })
  
  it('service should be contained in parent container', () => {
    expect((parent as any).container.get(Child1Service)).to.be.instanceOf(Child1Service);
  })
});
