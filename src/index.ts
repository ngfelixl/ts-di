import 'reflect-metadata';
import { Container, injectable, inject } from 'inversify';
import { ServiceIdentifierOrFunc } from 'inversify/dts/annotation/inject';

interface DecoratorConfig {
  imports?: any[];
  providers?: any[];
  declarations?: any[];
  exports?: any[];
}


/**
 * FlModule decorator
 * @param config as { imports?: any[], providers?: any[], declarations?: any[], exports?: any[] }
 * 
 * imports: Creates an instance of imported modules without container bindings, binds exports of child to own container
 * 
 * providers: Binds class definition to container
 * 
 * declarations: Binds class definition to container and creates an instance
 * 
 * exports: Binds exports array to reflect-metadata to be accessible by imports
 */
export function FlModule(config: DecoratorConfig) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    // console.log(`\nConstructing ${constructor.name}`); // MyClass
    let container = new Container({ defaultScope: "Singleton" });

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
        const instance = new importsArray[i]()
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
      var exportsArray = config.exports.reduce((a, b) => Array.isArray(b) ? [...a, ...b] : [...a, b], []);
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
      container = container;
    }
  }
}

/**
 * @return inversify injectable()
 */
export function Injectable() {
  return injectable();
}

/**
 * @return inversify injectable()
 */
export function Component() {
  return injectable();
}

/**
 * 
 * @param serviceIdentifier
 * @return inversify inject(serviceIdentifier)
 */
export function Inject(serviceIdentifier: ServiceIdentifierOrFunc) {
  return inject(serviceIdentifier);
}