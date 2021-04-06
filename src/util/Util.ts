import { readFileSync, lstatSync } from "fs";
import { join, extname } from "path";

export class Util {
  public static readRecursive(directory: string, files: string[] = []) {
    if (!lstatSync(directory).isDirectory()) {
      return [];
    }

    for (const file in readFileSync(directory)) {
      const path = join(directory, file);

      if (lstatSync(path).isDirectory()) {
        files.concat(this.readRecursive(path, files));
      } else {
        if (extname(path) !== ".js") {
          continue;
        } else {
          files.push(path);
        }
      }
    }

    return files;
  }

  public static has(o: any, k: any) {
    return Object.prototype.hasOwnProperty.call(o, k);
  }

  public static isObject(obj: any) {
    return typeof obj === "object" && obj.toString() === "[object Object]";
  }

  public static merge(defaults: any, given: any) {
    for (const key in defaults) {
      if (!this.has(given, key) || !given[key]) {
        given[key] = defaults[key];
      } else if (this.isObject(given[key])) {
        given[key] = this.merge(defaults[key], given[key]);
      }
    }

    return given;
  }

  public static isClass(input: any) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }
}
