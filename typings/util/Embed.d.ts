import { EmbedField, EmbedOptions } from "eris";
export declare class Embed {
    options: EmbedOptions;
    constructor(options?: EmbedOptions);
    setTitle(title: string): this;
    setDescription(description: string[] | string): this;
    setUrl(url: string): this;
    setColor(color: string | number): this;
    setImage(image: string): this;
    setThumbnail(image: string): this;
    setAuthor(name: string, url?: string, image?: string): this;
    addField(field: EmbedField): this;
    addFields(...fields: EmbedField[]): this;
    create(): EmbedOptions;
    private mergeToString;
    private toColor;
}
