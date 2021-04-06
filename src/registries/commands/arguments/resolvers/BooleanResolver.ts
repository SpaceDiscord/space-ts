import { Resolver } from "./Resolver";

export class BooleanResolver extends Resolver<boolean> {
  public parse(value: string) {
    return ["true", "false"].includes(value.toLowerCase());
  }
}
