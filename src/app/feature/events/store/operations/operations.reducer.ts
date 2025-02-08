import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createDefaultTimelineEvent } from '../../../authorized/dashboard/edit-event/editable-event-view.factory';
import { timelineFeature } from '../../../authorized/dashboard/store/timeline/timeline.reducer';
import { EventOperationsActions } from './operations.actions';
import { EventsState } from './operations.types';

const initialState: EventsState = {
  events: [],
  loading: false,
  showEditEventId: null,
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
      EventOperationsActions.successPushNewEvent,
      (state, { event }): EventsState => ({
        ...state,
        events: [event, ...state.events],
      })
    ),

    on(
      EventOperationsActions.successUpdateEvent,
      (state, { event }): EventsState => ({
        ...state,
        events: state.events.map(e => (event.id === e.id ? event : e)),
      })
    ),

    on(
      EventOperationsActions.stopEditingEvent,
      EventOperationsActions.successPushNewEvent,
      EventOperationsActions.successUpdateEvent,
      (state): EventsState => ({ ...state, showEditEventId: null })
    ),

    on(
      EventOperationsActions.dispatchEditEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        showEditEventId: eventId,
      })
    ),

    on(
      EventOperationsActions.emptyEvent,
      EventOperationsActions.apiException,
      (state): EventsState => ({
        ...state,
        events: state.events.filter(event => event.loading),
      })
    ),

    on(
      EventOperationsActions.deleteEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        events: state.events.map(event => ({
          ...event,
          loading: event.id === eventId ? true : event.loading,
        })),
      })
    ),

    on(
      EventOperationsActions.successDeleteEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        events: state.events.filter(event => event.id !== eventId),
      })
    ),

    on(
      EventOperationsActions.failedDeleteEvent,
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
