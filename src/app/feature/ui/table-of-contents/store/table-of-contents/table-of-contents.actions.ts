import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TableItem } from './table-of-contents.types';

export const TableOfContentsActions = createActionGroup({
  source: 'Table of contents',
  events: {
    'Clean items': emptyProps(),
    'Set table of contents': props<{ items: TableItem[] }>(),
  },
});
