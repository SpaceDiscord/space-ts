/// <reference types="node" />
import EventEmitter from "events";
export interface RegistryOptions {
    path: string;
}
export declare abstract class Registry<T> extends EventEmitter {
    modules: Map<string, T>;
    abstract load(): void;
    abstract unload(): void;
    abstract reload(): void;
    read(dir: string, files?: string[]): string[];
    findClass(value: any): any;
}
