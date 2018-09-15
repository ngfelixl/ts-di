[![Coverage Status](https://coveralls.io/repos/github/ngfelixl/fl-node-di/badge.svg?branch=master)](https://coveralls.io/github/ngfelixl/fl-node-di?branch=master)

# NodeJS dependency injection in Angular style

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
export class AppComponent {}
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

## Dependencies

- [inversify](http://inversify.io/)