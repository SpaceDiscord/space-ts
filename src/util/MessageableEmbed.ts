import { EmbedOptions, TextableChannel } from "eris";
import { Embed } from "./Embed";

export class MessageableEmbed extends Embed {
  private channel: TextableChannel;

  public constructor(channel: TextableChannel, options?: EmbedOptions) {
    super(options);

    this.channel = channel;
  }

  public send() {
    this.channel.createMessage({ embed: this.create() });
  }
}
