"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const chai_1 = require("chai");
require("mocha");
let serviceCounter = 0;
describe('Test exports', () => {
    let Child1Service = class Child1Service {
        constructor() {
            serviceCounter++;
            it('service should be instanciated once', () => {
                chai_1.expect(serviceCounter).to.be.eql(1);
            });
        }
    };
    Child1Service = __decorate([
        src_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], Child1Service);
    let Child1Component1 = class Child1Component1 {
        constructor(service) {
            it('service should be accessible in child 1 component', () => {
                chai_1.expect(service).to.be.instanceOf(Child1Service);
            });
        }
    };
    Child1Component1 = __decorate([
        src_1.Component(),
        __param(0, src_1.Inject(Child1Service)),
        __metadata("design:paramtypes", [Child1Service])
    ], Child1Component1);
    let Child1Component2 = class Child1Component2 {
    };
    Child1Component2 = __decorate([
        src_1.Component()
    ], Child1Component2);
    let Child2Component1 = class Child2Component1 {
        constructor(service) {
            it('service should be accessible in child 2 compoent', () => {
                chai_1.expect(service).to.be.instanceOf(Child1Service);
            });
        }
    };
    Child2Component1 = __decorate([
        src_1.Component(),
        __param(0, src_1.Inject(Child1Service)),
        __metadata("design:paramtypes", [Child1Service])
    ], Child2Component1);
    let ParentComponent = class ParentComponent {
        constructor(service) {
            it('service should be accessible in parent compoent', () => {
                chai_1.expect(service).to.be.instanceOf(Child1Service);
            });
        }
    };
    ParentComponent = __decorate([
        src_1.Component(),
        __param(0, src_1.Inject(Child1Service)),
        __metadata("design:paramtypes", [Child1Service])
    ], ParentComponent);
    let Child1 = class Child1 {
        constructor() { }
    };
    Child1 = __decorate([
        src_1.FlModule({
            declarations: [Child1Component1, Child1Component2],
            exports: [Child1Service]
        }),
        __metadata("design:paramtypes", [])
    ], Child1);
    let Child2 = class Child2 {
    };
    Child2 = __decorate([
        src_1.FlModule({
            declarations: [Child2Component1]
        })
    ], Child2);
    let Parent = class Parent {
    };
    Parent = __decorate([
        src_1.FlModule({
            imports: [Child1, Child2],
            declarations: [ParentComponent]
        })
    ], Parent);
    const parent = new Parent();
    parent.container.get(ParentComponent);
    it('should create a parent class', () => {
        chai_1.expect(parent).to.be.instanceOf(Parent);
    });
    it('service should be contained in parent container', () => {
        chai_1.expect(parent.container.get(Child1Service)).to.be.instanceOf(Child1Service);
    });
});
//# sourceMappingURL=exports.spec.js.map