import { Resolver } from "./Resolver";

export class StringResolver extends Resolver<string> {
  public parse(value: string) {
    return value.length ? value : null;
  }
}
