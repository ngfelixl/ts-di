import { Container, inject, injectable } from 'inversify';
import { ServiceIdentifierOrFunc } from 'inversify/dts/annotation/inject';
import 'reflect-metadata';

export interface IDecoratorConfig {
  imports?: any[];
  providers?: any[];
  declarations?: any[];
  exports?: any[];
}

/**
 * ## NestModule
 *
 * Creates a new Module which can be included into the dependency tree by
 * importing into other modules. These way all the application class instances
 * can be easily injected into the modules components.
 *
 * @param config
 *
 * ### Example
 *
 * ```typescript
 * @NestModule({
 *   imports: [],
 *   declarations: [],
 *   providers: [],
 *   exports: []
 * })
 * export class AppModule {}
 * ```
 *
 * ### Parameters
 *
 * - imports: Binds a child module to this module (creates instance and provides all provided services to child)
 * - providers: Constructs if injected into components
 * - declarations: Constructs immediately
 * - exports: Binds exports array to reflect-metadata to be accessible by imports
 */
export function NestModule(config: IDecoratorConfig) {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    const container = new Container({ defaultScope: 'Singleton' });

    if (config.providers) {
      const providersArray = config.providers.reduce((a, b) => (Array.isArray(b) ? [...a, ...b] : [...a, b]), []);
      for (const provider of providersArray) {
        container.bind(provider).to(provider);
      }
    }

    if (config.imports && config.imports.length > 0) {
      const importsArray = config.imports.reduce((a, b) => (Array.isArray(b) ? [...a, ...b] : [...a, b]), []);
      const instances = [];
      for (let i = 0; i < importsArray.length; i++) {
        const instance = new importsArray[i]();
        instances.push(instance);
        if (Reflect.hasMetadata('exports', instance.container)) {
          const exportsArray = Reflect.getMetadata('exports', instance.container);
          for (const exportObj of exportsArray) {
            container.bind(exportObj).to(exportObj);
          }
        }
        instances[i].container.parent = container;
      }

      for (const instance of instances) {
        if (Reflect.hasMetadata('declarations', instance.container)) {
          const declarationsArray = Reflect.getMetadata('declarations', instance.container);
          for (const declaration of declarationsArray) {
            instance.container.get(declaration);
          }
        }
      }
    }

    if (config.exports) {
      const exportsArray = config.exports.reduce((a, b) => (Array.isArray(b) ? [...a, ...b] : [...a, b]), []);
      Reflect.defineMetadata('exports', exportsArray, container);
    }

    if (config.declarations) {
      const declarationsArray = config.declarations.reduce((a, b) => (Array.isArray(b) ? [...a, ...b] : [...a, b]), []);
      for (const declaration of declarationsArray) {
        container.bind(declaration).toSelf();
      }
      Reflect.defineMetadata('declarations', declarationsArray, container);
    }

    return class extends constructor {
      public container = container;
    };
  };
}

/**
 * ## Injectable
 * An *Injectable* decorated class can be provided in **NestModules**
 * and all its child modules.
 *
 * ### Example
 *
 * Create the service as follows
 * ```typescript
 * @Injectable()
 * export class ExampleService {}
 * ```
 *
 * And provide it in your module (e.g. *AppModule*) and all child modules by
 *
 * ```typescript
 * @NestModule({
 *   imports: [ OneModule, TwoModule ],
 *   provide: [ ExampleService ]
 * })
 * export class AppModule {}
 * ```
 */
export function Injectable() {
  return injectable();
}

/**
 * ## Component
 *
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
 *
 * ```typescript
 * @Component()
 * export class ExampleComponent {}
 * ```
 *
 * #### Declaring the component
 *
 * ```typescript
 * @NestModule({
 *   declarations: [ ExampleComponent ],
 *   providers: [ ExampleService ]
 * })
 * export class AppModule {}
 * ```
 * #### Injecting the Service
 *
 * You can now inject the *ExampleService* in all the declared components
 * of this module. Here's an example
 *
 * ```typescript
 * @Component()
 * export class ExampleComponent {
 *   constructor(
 *     @Inject(ExampleService) service: ExampleService
 *   ) {}
 * }
 * ```
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
