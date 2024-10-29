import { Unique } from '../../../../app.types';

export type TableItem = Unique & {
  title: string;
  alt?: string;
};

export type TableOfContents = {
  items: TableItem[];
};
