import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from '../auth/auth.actions';
import { TableOfYearsActions } from './table-of-years.actions';
import { TableOfYearsState } from './table-of-years.types';

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
    })),
    on(AuthActions.cleanAuthState, () => initialState)
  ),
});
