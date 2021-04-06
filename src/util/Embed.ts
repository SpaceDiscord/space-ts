import { EmbedField, EmbedOptions } from "eris";
import { Util } from "./Util";

export class Embed {
  public options!: EmbedOptions;

  public constructor(options?: EmbedOptions) {
    if (options) {
      this.options = Util.merge(options, this.options);
    }

    this.options = {};
  }

  public setTitle(title: string) {
    this.options.title = title;

    return this;
  }

  public setDescription(description: string[] | string) {
    this.options.description = this.mergeToString(description);

    return this;
  }

  public setUrl(url: string) {
    this.options.url = url;

    return this;
  }

  public setColor(color: string | number) {
    this.options.color = this.toColor(color)!;

    return this;
  }

  public setImage(image: string) {
    this.options.image ??= {};

    this.options.image.url = image;

    return this;
  }

  public setThumbnail(image: string) {
    this.options.thumbnail ??= {};

    this.options.thumbnail.url = image;

    return this;
  }

  public setAuthor(name: string, url?: string, image?: string) {
    this.options.author = {
      name,
      url,
      icon_url: image,
    };

    return this;
  }

  public addField(field: EmbedField) {
    this.options.fields ??= [];

    this.options.fields.push(field);

    return this;
  }

  public addFields(...fields: EmbedField[]) {
    this.options.fields ??= [];

    this.options.fields!.push(...fields);

    return this;
  }

  public create() {
    return this.options;
  }

  private mergeToString(str: string[] | string) {
    return Array.isArray(str) ? str.join("\n") : str;
  }

  private toColor(value: string | number): number | null {
    const color =
      typeof value === "string" ? parseInt(value.replace("#", ""), 16) : value;
    return color < 0 || color > 0xffffff || isNaN(color) ? null : color;
  }
}
