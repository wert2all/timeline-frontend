import { createActionGroup, props } from '@ngrx/store';

export const TableOfYearsActions = createActionGroup({
  source: 'Table of years',
  events: {
    'Set active year': props<{ year: number; month?: number }>(),
  },
});
