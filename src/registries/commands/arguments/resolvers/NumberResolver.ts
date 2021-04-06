import { Resolver } from "./Resolver";

export class NumberResolver extends Resolver<number> {
  public parse(value: string) {
    return Number(value) || null;
  }
}
