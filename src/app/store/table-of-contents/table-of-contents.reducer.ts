import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { TableOfContentsActions } from './table-of-contents.actions';
import { TableOfContentsState } from './table-of-contents.types';

const initialState: TableOfContentsState = { items: [] };

export const tableOfYearFeature = createFeature({
  name: 'table-of-contents',
  reducer: createReducer(
    initialState,

    on(TableOfContentsActions.setTableOfContents, (state, { items }) => ({
      ...state,
      items,
    })),

    on(TableOfContentsActions.cleanItems, state => ({ ...state, items: [] }))
  ),
  extraSelectors: ({ selectItems }) => ({
    selectState: createSelector(selectItems, items => ({ items })),
  }),
});
