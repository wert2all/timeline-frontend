import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AuthInitialState } from './auth-initial-state.factory';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(AuthInitialState)),
  withComputed(store => ({
    isLoading: computed(() => store.loading() === true),
  })),
  withMethods(store => ({
    setToken(token: string | null): void {
      patchState(store, { token: token });
    },
    setLoading(loading: boolean): void {
      patchState(store, { loading: loading });
    },
  }))
);
