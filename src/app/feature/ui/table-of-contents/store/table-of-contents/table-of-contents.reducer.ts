import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { TableOfContentsActions } from './table-of-contents.actions';
import { TableOfContentsState } from './table-of-contents.types';

const initialState: TableOfContentsState = { items: [] };

export const tableOfYearFeature = createFeature({
  name: 'table-of-contents',
  reducer: createReducer(
    initialState,

    on(
      TableOfContentsActions.setTableOfContents,
      (state, { items }): TableOfContentsState => ({
        ...state,
        items,
      })
    ),

    on(
      TableOfContentsActions.cleanItems,
      (state): TableOfContentsState => ({ ...state, items: [] })
    )
  ),
  extraSelectors: ({ selectItems }) => ({
    selectState: createSelector(selectItems, items => ({ items })),
  }),
});
