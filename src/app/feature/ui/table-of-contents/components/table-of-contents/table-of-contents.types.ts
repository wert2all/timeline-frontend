import { Unique } from '../../../../../app.types';

export type TableItem = Unique & {
  title: string;
  link?: string;
  alt?: string;
};

export interface TableOfContents {
  items: TableItem[];
}
