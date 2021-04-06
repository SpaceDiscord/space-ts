import { Argument } from "../Command";
import { TypeResolver } from "./TypeResolver";

export interface ParserOptions {
  seperator: string;
  flags: Argument[];
  quoted: boolean;
}

export interface ParserResult {
  failed: string[];
  phrases: string[];
  flags: Map<string, any>;
}

const quotes = ["'", '"'];

export class Parser {
  public seperator = " ";
  public flags: Argument[] = [];
  public quoted = true;

  public content: string;
  private index = 0;

  private resolver: TypeResolver;

  public constructor(
    content: string,
    options: ParserOptions,
    resolver: TypeResolver
  ) {
    this.resolver = resolver;

    this.content = content;

    this.seperator = options.seperator ?? " ";
    this.flags = options.flags ?? [];
    this.quoted = options.quoted ?? true;
  }

  public next() {
    this.index += 1;
  }

  public parse(): ParserResult {
    const result = {
      failed: [] as any[],
      phrases: [] as string[],
      flags: new Map<string, any>(),
    };

    // @ts-expect-error
    this.content = this.content.split(this.seperator);

    for (const phrase of this.content) {
      this.next();

      if (/-+([a-z0-9]+)/gi.test(phrase)) {
        // @ts-expect-error
        const key = /-+([a-z0-9]+)/gi.exec(phrase)[1];
        const flag = this.flags.find(
          (flag) => flag.key.toLowerCase() === key.toLowerCase()
        );

        if (!flag?.type) {
          result.flags.set(key, true);
          continue;
        } else {
          // @ts-expect-error
          let [, k, value] = /-+([a-z0-9]+)(?:=|\s)((?:["'])?\w+)?/gi.exec(
            phrase
          );

          if (value) {
            if (
              quotes.find((quote) => value.startsWith(quote)) &&
              flag.type === "string"
            ) {
              result.flags.set(k, this.parseQuoted());
            } else {
              if (
                flag.type === "string" &&
                this.resolver.type("string")!(value)
              ) {
                result.flags.set(k, value);
                continue;
              } else {
                const res = this.resolver.type(flag.type)!(value);
                if (!res && flag.defaultValue) {
                  result.flags.set(k, flag.defaultValue);
                } else {
                  result.failed.push({
                    name: flag.key,
                    provided: value,
                  });

                  continue;
                }
              }
            }
          } else {
            result.flags.set(k, true);
          }

          continue;
        }
      }

      if (quotes.find((quote) => phrase.startsWith(quote)) && this.quoted) {
        result.phrases.push(this.parseQuoted());
      } else {
        result.phrases.push(phrase);
      }
    }

    return result;
  }

  public parseQuoted() {
    const parsed = [];

    for (const phrase of this.content.slice(this.index)) {
      // @ts-expect-error
      this.content.splice(this.index, 1);

      if (quotes.find((quote) => phrase.endsWith(quote))) {
        parsed.push(phrase.slice(0, phrase.length - 1));
        break;
      }

      parsed.push(phrase);
    }

    return parsed.join(this.seperator);
  }
}
