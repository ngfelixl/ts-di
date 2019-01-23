import { NestModule, Component, Injectable, Inject } from '../src';

import { expect } from 'chai';
import 'mocha';

let service1Counter = 0;
let service2Counter = 0;

describe('exports', () => {
  @Injectable()
  class Child1Service {
    constructor() {
      service1Counter++;
      it('service should be instanciated once', () => {
        expect(service1Counter).to.be.eql(1);
      })
    }
  }

  
  @Injectable()
  class Child2Service {
    constructor() {
      service2Counter++;
      it('service should be instanciated once', () => {
        expect(service2Counter).to.be.eql(1);
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


  @NestModule({
    declarations: [ Child1Component1, Child1Component2 ],
    exports: [ [ Child1Service ] ]
  })
  class Child1 {
    constructor() {}
  }

  @NestModule({
    declarations: [ [ Child2Component1 ] ],
    providers: [ [ Child2Service ] ],
    exports: [ Child2Service ]
  })
  class Child2 {}

  @NestModule({})
  class Child3 {}


  @NestModule({
    imports: [ [ Child1, Child2 ], Child3 ],
    declarations: [ [ ParentComponent ] ]
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
