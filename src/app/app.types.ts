import { EffectConfig } from '@ngrx/effects';

export interface Iterable {
  id: number;
}
export interface Loadable {
  loading: boolean;
}
export type Undefined = null | undefined;
export interface Clickable<T> {
  click: (item: T) => void;
}
// eslint-disable-next-line sonarjs/redundant-type-aliases
export type UniqueType = string;
export interface Unique {
  uuid: UniqueType;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;
export type KeyValue<T> = Record<string, T>;

export enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
}

export enum Pending {
  PENDING = 'PENDING',
}
export type StatusWithPending = Status | Pending;

export interface MaybeWithError {
  error?: Error | Undefined;
}
export interface WithStatus {
  status: Status;
}
export interface WithPandingStatus {
  status: Status | Pending;
}

export type DataWrapper<T> = MaybeWithError & WithStatus & { data?: T };

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
