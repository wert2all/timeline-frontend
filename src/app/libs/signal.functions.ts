import { Signal, WritableSignal, effect, signal } from '@angular/core';

export const mergeSignals = <T>(source: Signal<T>): WritableSignal<T> => {
  const sourceSignal = signal(source());
  effect(() => {
    sourceSignal.set(source());
  });
  return sourceSignal;
};

export const fromInputSignal = <T>(source: Signal<T>): WritableSignal<T> =>
  mergeSignals(source);
