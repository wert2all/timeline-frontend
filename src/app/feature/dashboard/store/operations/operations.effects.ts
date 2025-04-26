import { createEffect } from '@ngrx/effects';
import {
  StoreDispatchEffect,
  StoreUnDispatchEffect,
} from '../../../../app.types';
import {
  addTimeline,
  failedAddTimeline,
  redirectOnSuccessAddingTimeline,
} from './effects/add-timeline.effects';
import { setActiveTimeline } from './effects/set-active-timeline.effects';

export const dashboardOperationsEffects = {
  addTimeline: createEffect(addTimeline, StoreDispatchEffect),
  redirectOnSuccessAddingTimeline: createEffect(
    redirectOnSuccessAddingTimeline,
    StoreDispatchEffect
  ),
  failedAddTimeline: createEffect(failedAddTimeline, StoreUnDispatchEffect),

  setActiveTimeline: createEffect(setActiveTimeline, StoreDispatchEffect),
};
