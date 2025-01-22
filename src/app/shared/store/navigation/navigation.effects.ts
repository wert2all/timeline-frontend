import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Creator } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { StoreDispatchEffect } from '../../../app.types';
import { NavigationActions } from './navigation.actions';

const navEffect = (
  fromAction: ActionCreator<string, Creator>,
  dispatchAction: Creator<string[], Action<string>>,
  routes: string[]
) =>
  createEffect((actions = inject(Actions), router = inject(Router)) => {
    return actions.pipe(
      ofType(fromAction),
      tap(() => router.navigate(routes)),
      map(() => dispatchAction())
    );
  }, StoreDispatchEffect);

export const navigationEffects = {
  toHome: navEffect(NavigationActions.toHome, NavigationActions.afterToHome, [
    '/',
  ]),
  toLogin: navEffect(
    NavigationActions.toLogin,
    NavigationActions.afterToLogin,
    ['user', 'login']
  ),
  toDashboard: navEffect(
    NavigationActions.toUserDashboard,
    NavigationActions.afterToUserDashboard,
    ['my']
  ),
};
