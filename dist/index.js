"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
function FlModule(config) {
    return function (constructor) {
        let container = new inversify_1.Container({ defaultScope: "Singleton" });
        if (config.providers) {
            const providersArray = config.providers.reduce((a, b) => Array.isArray(b) ? [...a, ...b] : [...a, b], []);
            for (let i = 0; i < providersArray.length; i++) {
                container.bind(providersArray[i]).to(providersArray[i]);
            }
        }
        if (config.imports && config.imports.length > 0) {
            const importsArray = config.imports.reduce((a, b) => Array.isArray(b) ? [...a, ...b] : [...a, b], []);
            const instances = [];
            for (let i = 0; i < importsArray.length; i++) {
                const instance = new importsArray[i]();
                instances.push(instance);
                if (Reflect.hasMetadata('exports', instance.container)) {
                    const exportsArray = Reflect.getMetadata('exports', instance.container);
                    for (let j = 0; j < exportsArray.length; j++) {
                        container.bind(exportsArray[j]).to(exportsArray[j]);
                    }
                }
                instances[i].container.parent = container;
            }
            for (let i = 0; i < instances.length; i++) {
                const instance = instances[i];
                if (Reflect.hasMetadata('declarations', instance.container)) {
                    const declarationsArray = Reflect.getMetadata('declarations', instance.container);
                    for (let j = 0; j < declarationsArray.length; j++) {
                        instance.container.get(declarationsArray[j]);
                    }
                }
            }
        }
        if (config.exports) {
            const exportsArray = config.exports.reduce((a, b) => Array.isArray(b) ? [...a, ...b] : [...a, b], []);
            Reflect.defineMetadata('exports', exportsArray, container);
        }
        if (config.declarations) {
            const declarationsArray = config.declarations.reduce((a, b) => Array.isArray(b) ? [...a, ...b] : [...a, b], []);
            for (let i = 0; i < declarationsArray.length; i++) {
                container.bind(declarationsArray[i]).toSelf();
            }
            Reflect.defineMetadata('declarations', declarationsArray, container);
        }
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.container = container;
            }
        };
    };
}
exports.FlModule = FlModule;
function Injectable() {
    return inversify_1.injectable();
}
exports.Injectable = Injectable;
function Component() {
    return inversify_1.injectable();
}
exports.Component = Component;
function Inject(serviceIdentifier) {
    return inversify_1.inject(serviceIdentifier);
}
exports.Inject = Inject;
