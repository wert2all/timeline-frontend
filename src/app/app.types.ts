import { EffectConfig } from '@ngrx/effects';

export type Iterable = { id: number };
export type Loadable = { loading: boolean };
export type Undefined = null | undefined;
export interface Clickable<T> {
  click: (item: T) => void;
}
export type Unique = { uuid: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> = { [P in K]?: T };
export type KeyValue<T> = { [key: string]: T };

export enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
}

export enum Pending {
  PENDING = 'PENDING',
}
export type StatusWithPending = Status | Pending;

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
