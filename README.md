# @dimensional-fun/space-ts

A discord bot framework for TypeScript bots using Eris.

---

## Example Usages

For in-depth examples, check out [examples]()

---

### No Arguments:

```ts
import { Command, Context, command } from "@dimensional-fun/space-ts";

@command("hi", { triggers: ["hello"], description: "Says hello to the user" })
export default class PingCommand extends Command {
  exec(ctx: Context) {
    ctx.send(`Hi ${ctx.author.mention}! Glad to see you today!`);
  }
}
```

### Arguments:

```ts
import { Command, Context, command, arg } from "@dimensional-fun/space-ts";

@command("add", { triggers: ["+"], description: "Adds two numbers together" })
export default class AddCommand extends Command {
  @arg({ type: "number", min: 0, prompt: "Please provide a number" })
  @arg({ type: "number", prompt: "Please provide a second number" })
  exec(ctx: Context, [number1, number2]: [number, number]) {
    ctx.send(`Result: **${number1 + number2}**`);
  }
}
```

---
