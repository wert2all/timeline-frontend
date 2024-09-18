import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StoreDispatchEffect } from '../../app.types';
import { TableOfYearsActions } from './table-of-years.actions';
import { map } from 'rxjs';
import { inject } from '@angular/core';
import { AuthActions } from '../auth/auth.actions';

const loadTableOfYears = (action$ = inject(Actions)) => {
  return action$.pipe(
    ofType(AuthActions.successLoadUserAfterInit, AuthActions.successLoadUser),
    map(() =>
      TableOfYearsActions.successLoadTableOfYears({
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
      })
    )
  );
};
export const tableOfYearsEffects = {
  loadTableOfYears: createEffect(loadTableOfYears, StoreDispatchEffect),
};
