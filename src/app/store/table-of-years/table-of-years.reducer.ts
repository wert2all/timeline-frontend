import { createFeature, createReducer, on } from '@ngrx/store';
import { TableOfYearsState } from './table-of-years.types';
import { TableOfYearsActions } from './table-of-years.actions';

const initialState: TableOfYearsState = {
  years: [
    { number: 2024, skipCount: 2, isActive: true },
    { number: 2023, skipCount: 4, isActive: false },
    { number: 2022, skipCount: 6, isActive: false },
    { number: 2021, skipCount: 3, isActive: false },
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
