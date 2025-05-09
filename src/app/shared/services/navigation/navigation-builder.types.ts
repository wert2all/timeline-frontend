import { Undefined } from '../../../app.types';

export interface Destination {
  append(url: string, anchor: string | Undefined): Destination;
  getUrl(): string;
  getAnchor(): string | Undefined;
  getFullUrlString(): string;
}
