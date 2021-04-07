import { Constants } from "eris";
import { Util } from "../../util/Util";
import { Context } from "./Context";

export interface Argument {
  type?: string;
  key: string;
  defaultValue?: any;
  flag?: boolean;

  // this is for the type number
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

export type PermissionString = keyof Constants["Permissions"];

export interface CommandPermissions {
  user?: PermissionString[];
  bot?: PermissionString[];
  ownerOnly?: boolean;
  guildOnly?: boolean;
  nsfwOnly?: boolean;
}

export const command = (name: string, options: CommandOptions) => {
  return <T extends new (...args: any[]) => Command>(target: T): T => {
    // @ts-expect-error
    return class extends target {
      constructor(...args: any[]) {
        super(name, options);
        void args;
      }
    };
  };
};

export const argument = (options: Argument): MethodDecorator => {
  return (target, _, des) => {
    if (typeof des.value !== "function") {
      throw new TypeError(
        "@argument must only be applied to a method in a class."
      );
    }

    const arg =
      Reflect.getMetadata(`commandArguments`, target.constructor) ?? [];
    arg.push(options);

    Reflect.defineMetadata(`commandArguments`, arg, target.constructor);
  };
};

export abstract class Command {
  public trigger: string;
  public triggers: string[];
  public description: string;
  public category?: string;
  public permissions: CommandPermissions;
  public args: Argument[] = [];
  public shouldEdit: boolean;

  public constructor(trigger: string, options?: CommandOptions) {
    this.trigger = trigger;

    this.triggers = options?.triggers ?? [];
    this.description =
      options?.description ?? `No description provided for command ${trigger}`;

    this.category = options?.category ?? "uncategorized";

    this.permissions = Util.merge(
      {
        user: [],
        bot: [],
        ownerOnly: false,
        guildOnly: false,
        nsfwOnly: false,
      },
      options?.permissions ?? {}
    );

    this.shouldEdit = options?.shouldEdit ?? true;
  }

  abstract run(ctx: Context): any;
}
