import { Client, Message, PossiblyUncachedMessage } from "eris";
import { EventEmitter } from "events";

export interface MessageCollectorCollectOptions {
  messages?: number;
  time: number;
}

export class MessageCollector extends EventEmitter {
  public client: Client;
  public messages = new Map<string, Message>();
  public times = 0;

  // private options: MessageCollectorCollectOptions;

  public constructor(client: Client) {
    super();

    this.client = client;
  }

  // public async collect(
  //   filter: (message: Message) => boolean,
  //   options: MessageCollectorCollectOptions
  // ) {
  //   options.messages ??= 1;

  //   return new Promise((res, rej) => {
  //     this.client.on("messageCreate", (message) => {
  //       // @ts-expect-error
  //       this.messages.set(message.id, message);
  //       ++this.times;

  //       if (this.times >= options.messages!) {
  //         res(this.messages);
  //         return;
  //       }
  //     });
  //   });
  // }

  private _onMessage(message: PossiblyUncachedMessage) {
    // @ts-expect-error
    this.messages.set(message.id, message);
    ++this.times;

    // if (this.times >= options.messages!) {
    //   res(this.messages);
    //   return;
    // }
  }
}
