import { createFeature, createReducer, on } from '@ngrx/store';
import { TableOfYearsState } from './table-of-years.types';
import { TableOfYearsActions } from './table-of-years.actions';

const initialState: TableOfYearsState = {
  years: [
    {
      number: 2024,
      isActive: true,
      subItems: [
        { number: 1, text: 'jan' },
        { skip: true },
        { number: 2, text: 'feb' },
        { text: 'mar' },
        { skip: true },
        { skip: true },
        { skip: true },
        { skip: true },
      ],
    },
  ],
};

export const tableOfYearFeature = createFeature({
  name: 'table-of-year',
  reducer: createReducer(
    initialState,
    on(TableOfYearsActions.setActiveYear, (state, action) => ({
      ...state,
      years: state.years.map(year => ({
        ...year,
        isActive: year.number === action.year,
      })),
    }))
  ),
});
