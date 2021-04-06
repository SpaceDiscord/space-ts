import {
  Resolver,
  StringResolver,
  NumberResolver,
  BooleanResolver,
  ColorResolver,
} from "./resolvers";

export class TypeResolver {
  public resolvers = new Map<string, Resolver<any>>();

  public constructor() {
    this.addDefaults();
  }

  public addDefaults() {
    if (!this.resolvers.size) {
      this.resolvers.set("string", new StringResolver());
      this.resolvers.set("number", new NumberResolver());
      this.resolvers.set("boolean", new BooleanResolver());
      this.resolvers.set("color", new ColorResolver());
    }
  }

  public add(name: string, resolver: Resolver<any>) {
    if ([...this.resolvers.keys()].includes(name.toLowerCase())) {
      return;
    }

    this.resolvers.set(name, resolver);
  }

  public type(name: string): Function | null {
    return this.resolvers.get(name.toLowerCase())?.parse ?? null;
  }
}
