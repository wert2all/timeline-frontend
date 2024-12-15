import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AuthActions } from '../auth/auth.actions';
import {
  createDefaultTimelineEvent,
  createViewTimelineEvent,
} from './editable-event-view.factory';
import { EventActions, TimelineActions } from './timeline.actions';
import { ExistViewTimelineEvent, TimelineState } from './timeline.types';

const initialState: TimelineState = {
  loading: false,
  timelines: [],
  activeTimeline: null,
  events: [],
  newTimelineAdded: false,
  editEvent: null,
};

export const timelineFeature = createFeature({
  name: 'timeline',
  reducer: createReducer(
    initialState,
    on(
      TimelineActions.addTimeline,
      EventActions.loadActiveTimelineEvents,
      state => ({ ...state, loading: true })
    ),

    on(
      TimelineActions.successAddTimeline,
      EventActions.successLoadActiveTimelineEvents,
      state => ({ ...state, loading: false })
    ),

    on(
      TimelineActions.emptyTimeline,
      TimelineActions.apiException,
      EventActions.apiException,
      EventActions.emptyEvent,
      state => ({
        ...state,
        loading: false,
      })
    ),

    on(TimelineActions.successAddTimeline, (state, { timelines }) => ({
      ...state,
      timelines: [...timelines, ...state.timelines],
    })),

    on(
      TimelineActions.setActiveTimelineAfterAuthorize,
      (state, { timeline }) => ({
        ...state,
        activeTimeline: timeline
          ? { id: timeline.id, name: timeline.name || '' }
          : null,
      })
    ),

    on(EventActions.emptyEvent, EventActions.apiException, state => ({
      ...state,
      events: state.events.filter(event => !event.loading),
    })),

    on(EventActions.successLoadActiveTimelineEvents, (state, { events }) => ({
      ...state,
      events: [...events, ...state.events],
    })),

    on(TimelineActions.successAddTimeline, state => ({
      ...state,
      newTimelineAdded: true,
    })),

    on(
      EventActions.showAddEventForm,
      (state, { timelineId }): TimelineState => ({
        ...state,
        editEvent: {
          loading: false,
          event: createDefaultTimelineEvent(timelineId),
        },
      })
    ),

    on(
      EventActions.showEditEventForm,
      (state, { eventId }): TimelineState => ({
        ...state,
        editEvent: {
          event: state.events.find(event => event.id === eventId),
          loading: false,
        },
      })
    ),

    on(
      EventActions.closeEditForm,
      EventActions.nothingToSave,
      EventActions.successPushNewEvent,
      EventActions.successUpdateEvent,
      (state): TimelineState => ({ ...state, editEvent: null })
    ),

    on(
      EventActions.updatePreviewOfEditableEvent,
      (state, { event }): TimelineState => ({
        ...state,
        editEvent: {
          loading: state.editEvent?.loading || false,
          event: event,
        },
      })
    ),

    on(EventActions.saveEditableEvent, (state): TimelineState => {
      let editEvent = state.editEvent;
      if (editEvent) {
        editEvent = { ...editEvent, loading: true };
      }
      return { ...state, editEvent: editEvent };
    }),

    on(
      EventActions.successPushNewEvent,
      (state, { event }): TimelineState => ({
        ...state,
        events: [event, ...state.events],
      })
    ),

    on(
      EventActions.successUpdateEvent,
      (state, { event }): TimelineState => ({
        ...state,
        events: state.events.map(e => (e.id === event.id ? event : e)),
      })
    ),

    on(EventActions.deleteEvent, (state, { eventId }) => ({
      ...state,
      events: state.events.map(event => ({
        ...event,
        loading: event.id === eventId ? true : event.loading,
      })),
    })),

    on(EventActions.successDeleteEvent, (state, { eventId }) => ({
      ...state,
      events: state.events.filter(event => event.id !== eventId),
    })),

    on(EventActions.failedDeleteEvent, (state, { eventId }) => ({
      ...state,
      events: state.events.map(event => ({
        ...event,
        loading: event.id === eventId ? false : event.loading,
      })),
    })),

    on(AuthActions.cleanAuthState, () => initialState)
  ),

  extraSelectors: ({ selectEvents, selectLoading, selectEditEvent }) => ({
    isLoading: createSelector(selectLoading, loading => loading),
    selectViewEvents: createSelector(selectEvents, selectEvents =>
      selectEvents.map(
        (event, index): ExistViewTimelineEvent => ({
          ...createViewTimelineEvent(event, index % 2 === 0),
          id: event.id,
        })
      )
    ),
    isEditingEvent: createSelector(
      selectEditEvent,
      selectEditEvent => selectEditEvent !== null
    ),
  }),
});
