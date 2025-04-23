export interface Destination {
  append(url: string): Destination;
  toString(): string;
}
