import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Year } from './table-of-years.types';

export const TableOfYearsActions = createActionGroup({
  source: 'Table of years',
  events: {
    'Load table of years': emptyProps(),
    'Success load table of years': props<{ years: Year[] }>(),
    'Set active year': props<{ year: number; month?: number }>(),
  },
});
