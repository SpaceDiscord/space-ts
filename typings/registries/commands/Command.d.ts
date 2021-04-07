import { Constants } from "eris";
import { Context } from "./Context";
export interface Argument {
    type?: string;
    key: string;
    defaultValue?: any;
    flag?: boolean;
    min?: number;
    max?: number;
}
export interface CommandOptions {
    triggers?: string[];
    description?: string;
    category?: string;
    permissions?: CommandPermissions;
    shouldEdit?: boolean;
}
export declare type PermissionString = keyof Constants["Permissions"];
export interface CommandPermissions {
    user?: PermissionString[];
    bot?: PermissionString[];
    ownerOnly?: boolean;
    guildOnly?: boolean;
    nsfwOnly?: boolean;
}
export declare const command: (name: string, options: CommandOptions) => <T extends new (...args: any[]) => Command>(target: T) => T;
export declare const argument: (options: Argument) => MethodDecorator;
export declare abstract class Command {
    trigger: string;
    triggers: string[];
    description: string;
    category?: string;
    permissions: CommandPermissions;
    args: Argument[];
    shouldEdit: boolean;
    constructor(trigger: string, options?: CommandOptions);
    abstract run(ctx: Context): any;
}
