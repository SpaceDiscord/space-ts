import { Argument } from "../Command";
import { TypeResolver } from "./TypeResolver";
export interface ParserOptions {
    seperator: string;
    flags: Argument[];
    quoted: boolean;
}
export interface ParserResult {
    failed: string[];
    phrases: string[];
    flags: Map<string, any>;
}
export declare class Parser {
    seperator: string;
    flags: Argument[];
    quoted: boolean;
    content: string;
    private index;
    private resolver;
    constructor(content: string, options: ParserOptions, resolver: TypeResolver);
    next(): void;
    parse(): ParserResult;
    parseQuoted(): string;
}
