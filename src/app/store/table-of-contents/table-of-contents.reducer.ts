import { createFeature, createReducer } from '@ngrx/store';
import { TableOfContentsState } from './table-of-contents.types';

const initialState: TableOfContentsState = { items: [] };

export const tableOfYearFeature = createFeature({
  name: 'table-of-contents',
  reducer: createReducer(initialState),
});
