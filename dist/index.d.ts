import 'reflect-metadata';
import { Container } from 'inversify';
import { ServiceIdentifierOrFunc } from 'inversify/dts/annotation/inject';
export interface DecoratorConfig {
    imports?: any[];
    providers?: any[];
    declarations?: any[];
    exports?: any[];
}
export declare function FlModule(config: DecoratorConfig): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        container: Container;
    };
} & T;
export declare function Injectable(): (target: any) => any;
export declare function Component(): (target: any) => any;
export declare function Inject(serviceIdentifier: ServiceIdentifierOrFunc): (target: any, targetKey: string, index?: number | undefined) => void;
