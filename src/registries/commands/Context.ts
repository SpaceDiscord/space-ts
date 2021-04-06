import {
  Client,
  Guild,
  Member,
  Message,
  Shard,
  TextableChannel,
  User,
  MessageContent,
} from "eris";
import { MessageableEmbed } from "../../util";
import { Embed } from "../../util/Embed";
import { ParserResult } from "./arguments";
import { Command } from "./Command";
import { CommandRegistry } from "./CommandRegistry";

export class Context {
  public client: Client;
  public registry: CommandRegistry;
  public command: Command;

  public message: Message;
  public guild: Guild | null;
  public shard: Shard | null;
  public channel: TextableChannel;
  public author: User;
  public member: Member | null = null;

  public prefix: string;
  public trigger: string;

  public flags: Map<string, any>;
  public args: any[];
  public rawArgs: any[];
  public failedArgs: any[];

  public lastResponse!: Message;
  public shouldEdit = false;

  public constructor(
    client: Client,
    message: Message,
    command: Command,
    trigger: string,
    prefix: string,
    registry: CommandRegistry,
    parserResult: ParserResult
  ) {
    this.client = client;
    this.registry = registry;
    this.command = command;

    this.message = message;
    this.guild = client.guilds.get(message.guildID!) ?? null;
    this.shard = this.guild?.shard ?? client.shards.get(0)!;
    this.channel = message.channel;
    this.author = message.author;
    this.member = message.member ?? null;

    this.prefix = prefix;
    this.trigger = trigger;

    this.flags = parserResult.flags;
    this.args = parserResult.phrases;
    this.rawArgs = message.content.slice(this.prefix.length).split(" ");
    this.failedArgs = parserResult.failed;
  }

  public async send(message: string | MessageContent | Embed) {
    let options: MessageContent = {};

    if (typeof message === "string") {
      options.content = message;
    } else if (message instanceof Embed) {
      options.embed = message.create();
    } else {
      options = message;
    }

    if (this.lastResponse && this.shouldEdit) {
      this.lastResponse = await this.lastResponse.edit(options);
    } else {
      this.lastResponse = await this.channel.createMessage(options);
    }

    return this.lastResponse;
  }

  public async reply(
    to: Message | string,
    message: string | MessageContent | Embed
  ) {
    let options: MessageContent = {
      messageReferenceID: typeof to === "object" ? to.id : to,
    };

    if (typeof message === "string") {
      options.content = message;
    } else if (message instanceof Embed) {
      options.embed = message.create();
    } else {
      options = message;
    }

    if (this.lastResponse && this.shouldEdit) {
      this.lastResponse = await this.lastResponse.edit(options);
    } else {
      this.lastResponse = await this.channel.createMessage(options);
    }

    return this.lastResponse;
  }

  public async quote(
    to: Message | string,
    message: string | MessageContent | Embed
  ) {
    let options: MessageContent = {};

    if (typeof message === "string") {
      options.content = message;
    } else if (message instanceof Embed) {
      options.embed = message.create();
    } else {
      options = message;
    }

    options.content = `> ${typeof to === "object" ? to.content : to}\n${
      options.content
    }`;

    if (this.lastResponse && this.shouldEdit) {
      this.lastResponse = await this.lastResponse.edit(options);
    } else {
      this.lastResponse = await this.channel.createMessage(options);
    }

    return this.lastResponse;
  }

  public get embed() {
    return new MessageableEmbed(this.channel);
  }
}
