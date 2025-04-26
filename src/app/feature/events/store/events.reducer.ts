import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EditEventActions } from '../../dashboard/store/operations/actions/edit-event.actions';
import { fromApiEventToState } from '../../dashboard/store/operations/effects/edit-event.effects';
import { createDefaultTimelineEvent } from '../share/editable-event-view.factory';
import { ShowEventActions } from './actions/show.actions';
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
      EditEventActions.emptyEvent,
      EditEventActions.apiException,
      ShowEventActions.errorLoadEvent,
      EditEventActions.successUpdateEvent,
      EditEventActions.successPushNewEvent,
      ShowEventActions.successLoadEvent,
      (state): EventsState => ({
        ...state,
        loading: false,
      })
    ),
    on(
      EditEventActions.pushNewEventToAPI,
      EditEventActions.updateExistEventOnAPI,
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
      EditEventActions.dispatchAddNewEvent,
      (state, { timelineId }): EventsState => ({
        ...state,
        editedEvent: createDefaultTimelineEvent(timelineId),
      })
    ),

    on(
      EditEventActions.stopEditingEvent,
      EditEventActions.successPushNewEvent,
      EditEventActions.successUpdateEvent,
      (state): EventsState => ({
        ...state,
        editedEvent: null,
      })
    ),

    on(
      EditEventActions.successLoadEditableEvent,
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
