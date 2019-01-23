

# Hierarchical NodeJS dependency injection inspired by Angular

See this library in action with this [stackblitz demo](https://stackblitz.com/edit/ts-nest).

[![Build Status](https://travis-ci.org/ngfelixl/ts-nest.svg?branch=master)](https://travis-ci.org/ngfelixl/ts-nest)
[![Coverage Status](https://coveralls.io/repos/github/ngfelixl/ts-nest/badge.svg?branch=master&service=github)](https://coveralls.io/github/ngfelixl/ts-nest?branch=master)
[![npm version](https://badge.fury.io/js/ts-nest.svg)](https://badge.fury.io/js/ts-nest)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/ts-nest/)

## Installation

Add the package to your project

```bash
npm i --save ts-nest
# or
yarn add ts-nest
```

Import the decorators with

```typescript
import { NestModule, Component, Injectable, Inject } from 'ts-nest'
```

## Usage

NodeJS dependency injection module on top of [inversify](http://inversify.io/) for using
backend DI in a way similar to Angulars DI. E.g. you can use the following snippet throughout
your complete application

```typescript
@NestModule({
  imports: [ AuthModule, Http2Module ],
  declarations: [ AppComponent ],
  providers: [ AuthService ],
  exports: [ ]
})
export class AppModule {}
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

The decorators:

| Decorator                    | Description         | Parameters        | Return value         |
| ---------------------------- | ------------------- | ----------------- | -------------------- |
| `@NestModule()`              | Creates a container where the classes are stored, imports child-NestModules | config: { imports?: any[], declarations?: any[], providers?: any[], exports?: any[] } | Returns a custom decorator where a container object is created in the constructor |
| `@Injectable()`              | Make class bindable to an NestModules container | -         | Inversify @injectable()   |
| `@Component()`               | Make class bindable to an NestModules container | -         | Inversify @injectable()   | 
| `@Inject(serviceIdentifier)` | Let the DI know that a class instance is needed, if not exist, create class | serviceIdentifier    | -       |

The `@NestModule()` parameters:

| Input parameter              | Description                      |
| ---------------------------- | -------------------------------- |
| imports                      | Creates an instance of the imported `NestModule()`, reads the exports parameter of the instantiated object and stores the exports in its own container. The instance is handled as a child of this module, so Inject()s will work in the child even if the child does not contain the instance itself, but its parent. |
| declarations                 | Binds `@Component()` decorated classes to the container and after creating all imports it directly creates an instance. |
| providers                    | Binds `@Injectable()` decorated classes to the container |
| exports                      | Binds `@Injectable()` or `@Component()` decorated classes to the parents container |

## Dependencies

- [inversify](http://inversify.io/)
- [reflect-metadata](https://github.com/rbuckton/reflect-metadata)