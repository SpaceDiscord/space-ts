export declare abstract class Resolver<T> {
    abstract parse(value: string): T | null;
}
