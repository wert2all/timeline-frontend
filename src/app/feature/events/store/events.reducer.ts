import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createDefaultTimelineEvent } from '../share/editable-event-view.factory';
import { EventOperationsActions } from './actions/operations.actions';
import { ShowEventActions } from './actions/show.actions';
import { fromApiEventToState } from './effects/operations.effects';
import { EventsState } from './events.types';

const initialState: EventsState = {
  loading: false,
  error: null,
  editedEvent: null,
  showEvent: null,
};
export const eventsFeature = createFeature({
  name: 'events',
  reducer: createReducer(
    initialState,

    on(
      EventOperationsActions.emptyEvent,
      EventOperationsActions.apiException,
      ShowEventActions.errorLoadEvent,
      EventOperationsActions.successUpdateEvent,
      EventOperationsActions.successPushNewEvent,
      ShowEventActions.successLoadEvent,
      (state): EventsState => ({
        ...state,
        loading: false,
      })
    ),
    on(
      EventOperationsActions.pushNewEventToAPI,
      EventOperationsActions.updateExistEventOnAPI,
      ShowEventActions.loadEvent,
      (state): EventsState => ({
        ...state,
        loading: true,
      })
    ),

    on(
      ShowEventActions.errorLoadEvent,
      (state, { error }): EventsState => ({ ...state, error })
    ),

    on(ShowEventActions.successLoadEvent, (state, { event }): EventsState => {
      return { ...state, showEvent: fromApiEventToState(event) };
    }),
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
