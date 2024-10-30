import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { map } from 'rxjs';
import { StoreDispatchEffect } from '../../app.types';
import { TableOfContentsActions } from './table-of-contents.actions';

const onInit = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(ROUTER_NAVIGATED),
    map(() => TableOfContentsActions.cleanItems())
  );
export const tableOfYearsEffects = {
  onInit: createEffect(onInit, StoreDispatchEffect),
};
