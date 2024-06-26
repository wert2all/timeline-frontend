import { EffectConfig } from '@ngrx/effects';

export type Iterable = { id: number };
export type Loadable = { loading: boolean };

export type User = { name: string; avatar: string | null };

export enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
}

export type DataWrapper<T> = { status: Status; data?: T; error?: Error };

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
