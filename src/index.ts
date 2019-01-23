import 'reflect-metadata';
import { Container, injectable, inject } from 'inversify';
import { ServiceIdentifierOrFunc } from 'inversify/dts/annotation/inject';

export interface DecoratorConfig {
  imports?: any[];
  providers?: any[];
  declarations?: any[];
  exports?: any[];
}

/**
 * ## NestModule decorator
 * 
 * Creates a new Module which can be included into the dependency tree by
 * importing into other modules. These way all the application class instances
 * can be easily injected into the modules components.
 * 
 * @param config
 * 
 * 
 * ### Example
 * 
 * ```
@NestModule({
  imports: [],
  declarations: [],
  providers: [],
  exports: []
})
export class AppModule {}
```
 * ### Parameters
 * - imports: Binds a child module to this module (creates instance and provides all provided services to child)
 * - providers: Constructs if injected into components
 * - declarations: Constructs immediately
 * - exports: Binds exports array to reflect-metadata to be accessible by imports
 */
export function NestModule(config: DecoratorConfig) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
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
      container = container;
    }
  }
}

/**
 * ## Injectable
 * An *Injectable* decorated class can be provided in **NestModules**
 * and all its child modules.
 * 
 * ### Example
 * 
 * Create the service as follows
```
@Injectable()
export class ExampleService {
  // Service logic goes here
}
```
 * And provide it in your module (e.g. *AppModule*) and all child modules by
```
@NestModule({
  imports: [ OneModule, TwoModule ],
  provide: [ ExampleService ]
})
export class AppModule {}
```
 */
export function Injectable() {
  return injectable();
}

/**
 * ## Component
 * A *Component* decorated class can be declared in **NestModules**.
 * A declaration automatically creates an instance of the components
 * and adds it to the dependency tree. Services can be injected in
 * the components constructor.
 * 
 * ### Example
 * 
 * #### Class Definition
 * 
 * Define the component in the following way. Decorate it with the
 * *Component* decorator.
```
@Component()
export class ExampleComponent {}
```
 * 
 * #### Declaring the component
 * 
```
@NestModule({
  declarations: [ ExampleComponent ],
  providers: [ ExampleService ]
})
export class AppModule {}
```
 * #### Injecting the Service
 * 
 * You can now inject the *ExampleService* in all the declared components
 * of this module. Here's an example
 * 
```
@Component()
export class ExampleComponent {
  constructor(@Inject(ExampleService) service: ExampleService) {}
}
```
 */
export function Component() {
  return injectable();
}

/**
 * @param serviceIdentifier
 * @return inversify inject(serviceIdentifier)
 */
export function Inject(serviceIdentifier: ServiceIdentifierOrFunc) {
  return inject(serviceIdentifier);
}