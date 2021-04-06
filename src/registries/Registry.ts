import EventEmitter from "events";
import { Util } from "../util/Util";

export interface RegistryOptions {
  path: string;
}

export abstract class Registry<T> extends EventEmitter {
  public modules = new Map<string, T>();

  abstract load(): void;
  abstract unload(): void;
  abstract reload(): void;

  public read(dir: string, files: string[] = []) {
    return Util.readRecursive(dir, files);
  }

  public findClass(value: any) {
    if (typeof value !== "object") {
      return null;
    }

    if ("default" in value && Util.isClass(value.default)) {
      return value.default;
    }

    for (const v of Object.entries(value).values()) {
      if (Util.isClass(v)) {
        return v;
      }
    }

    return null;
  }
}
