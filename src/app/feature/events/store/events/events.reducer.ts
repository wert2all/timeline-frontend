import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createDefaultTimelineEvent } from '../../../authorized/dashboard/edit-event/editable-event-view.factory';
import { timelineFeature } from '../../../authorized/dashboard/store/timeline/timeline.reducer';
import { EventActions } from './events.actions';
import { EventsState } from './events.types';

const initialState: EventsState = {
  events: [],
  loading: false,
  showEditEventId: null,
};
export const eventsFeature = createFeature({
  name: 'events',
  reducer: createReducer(
    initialState,

    on(
      EventActions.emptyEvent,
      EventActions.apiException,
      EventActions.successUpdateEvent,
      EventActions.successPushNewEvent,
      (state): EventsState => ({
        ...state,
        loading: false,
      })
    ),

    on(
      EventActions.successPushNewEvent,
      (state, { event }): EventsState => ({
        ...state,
        events: [event, ...state.events],
      })
    ),

    on(
      EventActions.successUpdateEvent,
      (state, { event }): EventsState => ({
        ...state,
        events: state.events.map(e => (event.id === e.id ? event : e)),
      })
    ),

    on(
      EventActions.stopEditingEvent,
      EventActions.successPushNewEvent,
      EventActions.successUpdateEvent,
      (state): EventsState => ({ ...state, showEditEventId: null })
    ),

    on(
      EventActions.dispatchEditEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        showEditEventId: eventId,
      })
    ),

    on(
      EventActions.emptyEvent,
      EventActions.apiException,
      (state): EventsState => ({
        ...state,
        events: state.events.filter(event => event.loading),
      })
    ),

    on(
      EventActions.deleteEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        events: state.events.map(event => ({
          ...event,
          loading: event.id === eventId ? true : event.loading,
        })),
      })
    ),

    on(
      EventActions.successDeleteEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        events: state.events.filter(event => event.id !== eventId),
      })
    ),

    on(
      EventActions.failedDeleteEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        events: state.events.map(event => ({
          ...event,
          loading: event.id === eventId ? false : event.loading,
        })),
      })
    )
  ),
  extraSelectors: ({ selectShowEditEventId, selectEvents }) => {
    const selectActiveTimelineEventsSelector = createSelector(
      selectEvents,
      timelineFeature.selectActiveTimeline,
      (selectEvents, activeTimeline) =>
        Object.values(selectEvents).filter(
          event => event.timelineId === activeTimeline?.id
        )
    );
    const selectShouldEditEventSelector = createSelector(
      selectShowEditEventId,
      selectActiveTimelineEventsSelector,
      timelineFeature.selectActiveTimeline,
      (editEventId, events, activeTimeline) =>
        activeTimeline?.id && editEventId === 0
          ? createDefaultTimelineEvent(activeTimeline.id)
          : events.find(event => event.id === editEventId)
    );

    return {
      selectActiveTimelineEvents: selectActiveTimelineEventsSelector,
      isEditingEvent: createSelector(
        selectShouldEditEventSelector,
        event => !!event
      ),
      selectShouldEditEvent: selectShouldEditEventSelector,
    };
  },
});
