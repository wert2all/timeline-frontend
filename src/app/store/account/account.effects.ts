import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { StoreUnDispatchEffect } from '../../app.types';
import { AuthActions } from '../auth/auth.actions';
import { AccountActions } from './account.actions';

const cleanEffect = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AuthActions.cleanAuthState),
    map(() => AccountActions.cleanAccount())
  );

export const accountEffects = {
  cleanAccount: createEffect(cleanEffect, StoreUnDispatchEffect),
};
