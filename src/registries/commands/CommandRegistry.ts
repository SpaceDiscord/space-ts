import { Client, Message } from "eris";
import { Registry, RegistryOptions } from "../Registry";
import { TypeResolver, Parser } from "./arguments";
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

export class CommandRegistry extends Registry<Command> {
  public resolver = new TypeResolver();

  public categories = new Map<string, Command[]>();
  public contexts = new Map<string, Context>();

  public client: Client;
  public options: CommandRegistryOptions;

  public constructor(client: Client, options: CommandRegistryOptions) {
    super();

    this.client = client;
    this.options = options;

    this.client.on("messageCreate", this._handle.bind(this));
    this.client.on("messageUpdate", this._handle.bind(this));
  }

  public async load() {
    let unsuccessful = 0;

    for (const file of this.read(this.options.path)) {
      let command = this.findClass(await import(file));

      if (!command) {
        ++unsuccessful;
        continue;
      }

      // if (!(command instanceof Command)) {
      //   ++unsuccessful;
      //   continue;
      // }

      //// @ts-expect-error
      command = new command() as Command;

      if (this.modules.has(command.trigger)) {
        ++unsuccessful;
        continue;
      }

      const args =
        Reflect.getMetadata("commandArguments", command.constructor) ?? [];

      if (args.length) {
        for (const arg of args) {
          command.args.push(arg);
        }
      }

      this.modules.set(command.trigger, command);

      const categories = this.categories.get(command.category ?? "") ?? [];
      categories.push(command.category);
      this.categories.set(command.category, categories);
    }

    this.emit("loaded", this.modules.size, this.modules.size - unsuccessful);
  }

  public unload() {
    this.modules.clear();
  }

  public reload() {
    throw new Error("Method not implemented.");
  }

  public get mention() {
    return new RegExp(`^<@!?${this.client.user.id}>`);
  }

  private _handle(message: Message) {
    const prefix = this.getPrefix(message);

    if (message.author.bot || !prefix) {
      return;
    }

    const [cmd, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    const command = this.getCommand(cmd);

    if (command) {
      const result = new Parser(
        args.join(" "),
        {
          seperator: " ",
          quoted: true,
          flags: command.args.filter((arg) => arg.flag),
        },
        this.resolver
      ).parse();

      let context = this.contexts.get(message.id);
      if (!context) {
        context = new Context(
          this.client,
          message,
          command,
          cmd,
          prefix,
          this,
          result
        );

        this.contexts.set(message.id, context);
      }

      try {
        command.run(context);

        this.emit("commandRan", context, command);
      } catch (error) {
        this.emit("commandError", context, command, error);
      }
    }
  }

  public getCommand(name: string) {
    return [...this.modules.values()].find((command) =>
      [command.trigger, ...command.triggers].includes(name.toLowerCase())
    );
  }

  private getPrefix(message: Message) {
    if (this.mention.test(message.content)) {
      return `<@!${this.client.user.id}>`;
    }

    let prefixes;

    if (typeof this.options.prefix === "function") {
      prefixes = this.options.prefix(message);
    } else if (typeof this.options.prefix === "string") {
      prefixes = [this.options.prefix];
    } else {
      prefixes = this.options.prefix;
    }

    if (!Array.isArray(prefixes)) {
      prefixes = [prefixes];
    }

    return prefixes.find((prefix) =>
      message.content.toLowerCase().startsWith(prefix.toLowerCase())
    );
  }
}
