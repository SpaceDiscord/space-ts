import {
  SpaceClient,
  DefaultCommandRegistry,
  DefaultEventRegistry,
} from "@dimensional-fun/space-ts";
import { join } from "path";

const client = new SpaceClient("BOT TOKEN", {
  commands: new DefaultCommandRegistry({
    prefix: "!",
    owners: ["OWNER ID 1", "OWNER ID 2"],
    directory: join(__dirname, "commands"),
    commandEditing: true,
  }),
  events: new DefaultEventRegistry({
    directory: join(__dirname, "commands"),
  }),
});

client.connect();

// in commands/PingCommand.ts

import { Command, Context, command } from "@dimensional-fun/space-ts";

@command("ping", {
  triggers: ["pong"],
  description: "Displays the latency of the bot.",
})
export default class PingCommand extends Command {
  public exec(ctx: Context) {
    ctx.reply(`Latency: **${ctx.latency}**`);
  }
}
