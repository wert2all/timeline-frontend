import { EffectConfig } from '@ngrx/effects';

export type Iterable = { id: number };
export type Loadable = { loading: boolean };
export type Undefined = null | undefined;
export interface Clickable<T> {
  click: (item: T) => void;
}
export type UniqueType = string;
export type Unique = { uuid: UniqueType };

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

export type WithError = { error?: Error | Undefined };
export type WithStatus = { status: Status };
export type WithPandingStatus = { status: Status | Pending };

export type DataWrapper<T> = WithError & WithStatus & { data?: T };

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
