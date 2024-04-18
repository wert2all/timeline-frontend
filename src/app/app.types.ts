import { EffectConfig } from '@ngrx/effects';

export type Loadable = { loading: boolean };

export type User = { name: string; avatar: string | null };

export const StoreDispatchEffect: EffectConfig & {
  functional: true;
  dispatch?: true;
} = { functional: true };
export const StoreUnDispatchEffect: EffectConfig & {
  functional: true;
  dispatch: false;
} = {
  functional: true,
  dispatch: false,
};
