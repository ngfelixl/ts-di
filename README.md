

# Hierarchical NodeJS dependency injection inspired by Angular

Super lightweight (2kb) library for creating dependency trees in NodeJS applications
inpired by Angular. It is build on top of [inversify](http://inversify.io/). See this library in action with this
[stackblitz demo](https://stackblitz.com/edit/ts-nest).

[![Build Status](https://travis-ci.org/ngfelixl/ts-nest.svg?branch=master)](https://travis-ci.org/ngfelixl/ts-nest)
[![Coverage Status](https://coveralls.io/repos/github/ngfelixl/ts-nest/badge.svg?branch=master&service=github)](https://coveralls.io/github/ngfelixl/ts-nest?branch=master)
[![npm version](https://badge.fury.io/js/ts-nest.svg)](https://badge.fury.io/js/ts-nest)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
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

Create a `NestModule` as application entrypoint and import all the
wanted child modules, which are `NestModule`s themselves.

```typescript
@NestModule({
  imports: [ AuthModule, HttpModule ],
  declarations: [ AppComponent ],
  providers: [ AuthService ],
  exports: [ ]
})
export class AppModule {}
```

Bootstrap your application by simply contructing it

```typescript
const app = new AppModule();
```

There are two other types of objects in this dependency tree, `Component`s and
`Injectable`s. Components can be created like follows.

```typescript
@Component()
export class AppComponent {
  constructor (@Inject(AuthService) authService: AuthService) {}
}
```

As you may have recognized, the constructor receives an `Inject`ed parameter. This
parameter can be provided in your `NestModule`, like it is done in the first listing.
The `AuthService` is decorated by an `@Injectable()` decorator

```typescript
@Injectable()
export class AuthService {}
```

When it is provided, the application knows about it, but does not directly create an instance. It
gets instanciated when an `@Inject(serviceIdentifier)` is used as a constructor parameter in the
same or a childs containers class.

The DI system is hierarchical. So the class provided in the parent module will also be available in
all its children (with a single object instance).

## Cheatsheet

### Decorators

| Decorator                    | Description         | Parameters        | Return value         |
| ---------------------------- | ------------------- | ----------------- | -------------------- |
| `@NestModule()`              | Creates a container where the classes are stored, imports child-NestModules | config: { imports?: any[], declarations?: any[], providers?: any[], exports?: any[] } | Returns a custom decorator where a container object is created in the constructor |
| `@Injectable()`              | Make class bindable to an NestModules container | -         | Inversify @injectable()   |
| `@Component()`               | Make class bindable to an NestModules container | -         | Inversify @injectable()   | 
| `@Inject(serviceIdentifier)` | Let the DI know that a class instance is needed, if not exist, create class | serviceIdentifier    | -       |

### NestModule parameters

| Input parameter              | Description                      |
| ---------------------------- | -------------------------------- |
| imports                      | Creates an instance of the imported `NestModule()`, reads the exports parameter of the instantiated object and stores the exports in its own container. The instance is handled as a child of this module, so Inject()s will work in the child even if the child does not contain the instance itself, but its parent. |
| declarations                 | Binds `@Component()` decorated classes to the container and after creating all imports it directly creates an instance. |
| providers                    | Binds `@Injectable()` decorated classes to the container |
| exports                      | Binds `@Injectable()` or `@Component()` decorated classes to the parents container |

## Dependencies

- [inversify](http://inversify.io/)
- [reflect-metadata](https://github.com/rbuckton/reflect-metadata)

## Get in touch

[![twitter](https://img.shields.io/badge/twitter-%40ngfelixl-blue.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ngfelixl)
[![github](https://img.shields.io/badge/github-%40ngfelixl-blue.svg?logo=github)](https://github.com/ngfelixl)
[![stackoverflow](https://img.shields.io/badge/stackoverflow-%40ngfelixl-blue.svg?logo=stackoverflow)](https://stackoverflow.com/users/8808496/ngfelixl)

Hi, I am Felix,
Angular developer and NgRX contributor

![avatar](https://avatars2.githubusercontent.com/u/24190530?s=200&v=4)

If you like this library, think about giving it a star or follow me on twitter or github.
