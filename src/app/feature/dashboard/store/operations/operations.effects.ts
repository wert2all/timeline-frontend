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
import { deleteEvent, failedDeleteEvent } from './effects/delete-event.effects';
import {
  apiException,
  loadEditEventData,
  pushExistEventToApi,
  pushNewEventToApi,
  redirectOnCloseEditEvent,
  saveEditableEvent,
} from './effects/edit-event.effects';
import { setActiveTimeline } from './effects/set-active-timeline.effects';

export const dashboardOperationsEffects = {
  addTimeline: createEffect(addTimeline, StoreDispatchEffect),
  redirectOnSuccessAddingTimeline: createEffect(
    redirectOnSuccessAddingTimeline,
    StoreDispatchEffect
  ),
  failedAddTimeline: createEffect(failedAddTimeline, StoreUnDispatchEffect),

  setActiveTimeline: createEffect(setActiveTimeline, StoreDispatchEffect),

  deleteEvent: createEffect(deleteEvent, StoreDispatchEffect),
  failedDeleteEvent: createEffect(failedDeleteEvent, StoreUnDispatchEffect),

  loadEditableEvent: createEffect(loadEditEventData, StoreDispatchEffect),
  saveEditableEvent: createEffect(saveEditableEvent, StoreDispatchEffect),

  pushNewEventToApi: createEffect(pushNewEventToApi, StoreDispatchEffect),
  pushExistEventToApi: createEffect(pushExistEventToApi, StoreDispatchEffect),
  redirectOnCloseEditEvent: createEffect(
    redirectOnCloseEditEvent,
    StoreDispatchEffect
  ),
  apiException: createEffect(apiException, StoreUnDispatchEffect),
};
