import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createDefaultTimelineEvent } from '../../../authorized/dashboard/edit-event/editable-event-view.factory';
import { EventOperationsActions } from './operations.actions';
import { EventsState } from './operations.types';

const initialState: EventsState = {
  loading: false,
  editedEvent: null,
};
export const eventOperationsFeature = createFeature({
  name: 'events',
  reducer: createReducer(
    initialState,

    on(
      EventOperationsActions.emptyEvent,
      EventOperationsActions.apiException,
      EventOperationsActions.successUpdateEvent,
      EventOperationsActions.successPushNewEvent,
      (state): EventsState => ({
        ...state,
        loading: false,
      })
    ),
    on(
      EventOperationsActions.pushNewEventToAPI,
      EventOperationsActions.updateExistEventOnAPI,
      (state): EventsState => ({
        ...state,
        loading: true,
      })
    ),

    on(
      EventOperationsActions.dispatchAddNewEvent,
      (state, { timelineId }): EventsState => ({
        ...state,
        editedEvent: createDefaultTimelineEvent(timelineId),
      })
    ),

    on(
      EventOperationsActions.stopEditingEvent,
      EventOperationsActions.successPushNewEvent,
      EventOperationsActions.successUpdateEvent,
      (state): EventsState => ({
        ...state,
        editedEvent: null,
      })
    ),

    on(
      EventOperationsActions.dispatchEditEvent,
      (state, { event }): EventsState => ({
        ...state,
        editedEvent: event,
      })
    )
  ),
  extraSelectors: ({ selectEditedEvent }) => ({
    isEditingEvent: createSelector(selectEditedEvent, event => !!event),
  }),
});
