/// <reference types="node" />
import { Client, Message } from "eris";
import { EventEmitter } from "events";
export interface MessageCollectorCollectOptions {
    messages?: number;
    time: number;
}
export declare class MessageCollector extends EventEmitter {
    client: Client;
    messages: Map<string, Message<import("eris").TextableChannel>>;
    times: number;
    constructor(client: Client);
    private _onMessage;
}
