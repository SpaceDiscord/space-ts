import { Resolver } from "./Resolver";

export class ColorResolver extends Resolver<number> {
  public parse(value: string) {
    const color = parseInt(value.replace("#", ""), 16);
    return color < 0 || color > 0xffffff || isNaN(color) ? null : color;
  }
}
