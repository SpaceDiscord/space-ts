import { Resolver } from "./resolvers";
export declare class TypeResolver {
    resolvers: Map<string, Resolver<any>>;
    constructor();
    addDefaults(): void;
    add(name: string, resolver: Resolver<any>): void;
    type(name: string): Function | null;
}
