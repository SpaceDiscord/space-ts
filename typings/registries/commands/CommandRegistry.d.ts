import { Client, Message } from "eris";
import { Registry, RegistryOptions } from "../Registry";
import { TypeResolver } from "./arguments";
import { Command } from "./Command";
import { Context } from "./Context";
export interface CommandRegistryOptions extends RegistryOptions {
    prefix: string | string[] | ((message: Message) => string | string[]);
    editing?: CommandEditingOptions;
    owners?: string[];
}
export interface CommandEditingOptions {
    enabled: boolean;
    clearInterval?: number;
}
export declare class CommandRegistry extends Registry<Command> {
    resolver: TypeResolver;
    categories: Map<string, Command[]>;
    contexts: Map<string, Context>;
    client: Client;
    options: CommandRegistryOptions;
    constructor(client: Client, options: CommandRegistryOptions);
    load(): Promise<void>;
    unload(): void;
    reload(): void;
    get mention(): RegExp;
    private _handle;
    getCommand(name: string): Command | undefined;
    private getPrefix;
}
