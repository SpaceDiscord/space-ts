import { EmbedOptions, TextableChannel } from "eris";
import { Embed } from "./Embed";
export declare class MessageableEmbed extends Embed {
    private channel;
    constructor(channel: TextableChannel, options?: EmbedOptions);
    send(): void;
}
