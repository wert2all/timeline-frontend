import { createFeature, createReducer, on } from '@ngrx/store';
import { TableOfYearsState } from './table-of-years.types';
import { TableOfYearsActions } from './table-of-years.actions';

const initialState: TableOfYearsState = { years: [] };

export const tableOfYearFeature = createFeature({
  name: 'table-of-year',
  reducer: createReducer(
    initialState,
    on(TableOfYearsActions.successLoadTableOfYears, (state, action) => ({
      ...state,
      years: action.years,
    })),
    on(TableOfYearsActions.setActiveYear, (state, action) => ({
      ...state,
      years: state.years.map(year => ({
        ...year,
        isActive: year.number === action.year,
      })),
    }))
  ),
});
