import 'reflect-metadata';
import { Container } from 'inversify';
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
export declare function FlModule(config: DecoratorConfig): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        container: Container;
    };
} & T;
/**
 * @return inversify injectable()
 */
export declare function Injectable(): (target: any) => any;
/**
 * @return inversify injectable()
 */
export declare function Component(): (target: any) => any;
/**
 *
 * @param serviceIdentifier
 * @return inversify inject(serviceIdentifier)
 */
export declare function Inject(serviceIdentifier: ServiceIdentifierOrFunc): (target: any, targetKey: string, index?: number | undefined) => void;
export {};
