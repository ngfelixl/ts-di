[![Build Status](https://travis-ci.org/ngfelixl/fl-node-di.svg?branch=master)](https://travis-ci.org/ngfelixl/fl-node-di)
[![Coverage Status](https://coveralls.io/repos/github/ngfelixl/fl-node-di/badge.svg?branch=master)](https://coveralls.io/github/ngfelixl/fl-node-di?branch=master)

# NodeJS dependency injection in Angular style

## Installation

Add the package to your project

```bash
npm i --save fl-node-di
# or
yarn add fl-node-di
```

Import the decorators with

```typescript
import { FlModule, Component, Injectable, Inject } from 'fl-node-di'
```

## Usage

NodeJS dependency injection module on top of [inversify](http://inversify.io/) for using
backend DI in a way similar to Angulars DI. E.g. you can use the following snippet throughout
your complete application

```typescript
@FlModule({
  imports: [ AuthModule, Http2Module ],
  declarations: [ AppComponent ],
  providers: [ AuthService ],
  exports: [ ]
})
export class AppModule
```

The other two decorators are 

```typescript
@Component()
export class AppComponent {
  constructor (@Inject(AuthService) authService: AuthService) {}
}
```

which treats the decorator as an inversify `@injectable` and directly creates an instance when the
parent module gets instanciated. The other one is the `@Injectable()` decorator

```typescript
@Injectable()
export class AuthService {}
```

which returns an inversify `@injectable` decorator, but does not directly creates an instance but
instanciates itself when an `@Inject(serviceIdentifier)` is used as a constructor parameter in the
same or a childs containers class.

The DI system is hierarchical.

## Cheatsheet

| Decorator                    | Description         | Parameters        | Return value         |
| ---------------------------- | ------------------- | ----------------- | -------------------- |
| `@FlModule()`                | Creates a container where the classes are stored, imports child-FlModules | config: { imports?: any[], declarations?: any[], providers?: any[], exports?: any[] } | Returns a custom decorator where a container object is created in the constructor |
| `@Injectable()`              | Make class bindable to an FlModules container | -         | Inversify @injectable()   |
| `@Component()`               | Make class bindable to an FlModules container | -         | Inversify @injectable()   | 
| `@Inject(serviceIdentifier)` | Let the DI know that a class instance is needed, if not exist, create class | serviceIdentifier    | -       |

| Input parameter              | Description                      |
| ---------------------------- | -------------------------------- |
| imports                      | Creates an instance of the imported `FlModule()`, reads the exports parameter of the instantiated object and stores the exports in its own container. The instance is handled as a child of this module, so Inject()s will work in the child even if the child does not contain the instance itself, but its parent. |
| declarations                 | Binds `@Component()` decorated classes to the container and after creating all child inputs it directly creates an instance. |
| providers                    | Binds `@Injectable()` decorated classes to the container |
| exports                      | Binds `@Injectable()` or `@Component()` decorated classes to the parents container |

## Dependencies

- [inversify](http://inversify.io/)