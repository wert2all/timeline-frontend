import { createActionGroup, props } from '@ngrx/store';
import { TableItem } from './table-of-contents.types';

export const TableOfContentsActions = createActionGroup({
  source: 'Table of contents',
  events: {
    'Set table of contents': props<{ items: TableItem[] }>(),
  },
});
