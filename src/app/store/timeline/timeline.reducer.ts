import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Status } from '../../app.types';
import { AuthActions } from '../auth/auth.actions';
import { UploadActions } from '../images/images.actions';
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
      EventActions.loadTimelineEvents,
      TimelineActions.loadAccountTimelines,
      state => ({
        ...state,
        loading: true,
      })
    ),

    on(
      TimelineActions.successAddTimeline,
      EventActions.successLoadTimelineEvents,
      TimelineActions.successLoadAccountTimelines,
      state => ({ ...state, loading: false })
    ),

    on(
      TimelineActions.emptyTimeline,
      TimelineActions.emptyTimelines,
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

    on(EventActions.emptyEvent, EventActions.apiException, state => ({
      ...state,
      events: state.events.filter(event => !event.loading),
    })),

    on(EventActions.successLoadTimelineEvents, (state, { events }) => ({
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

    on(AuthActions.afterLogout, () => initialState),

    on(UploadActions.successUploadImage, (state, { id, status }) =>
      state.editEvent?.event && status === Status.SUCCESS
        ? {
            ...state,
            editEvent: {
              ...state.editEvent,
              event: { ...state.editEvent.event, imageId: id },
            },
          }
        : state
    ),

    on(TimelineActions.successLoadAccountTimelines, (state, { timelines }) => ({
      ...state,
      timelines,
    })),

    on(TimelineActions.setActiveTimeline, (state, { timeline }) => ({
      ...state,
      activeTimeline: {
        name: timeline.name || '',
        id: timeline.id,
      },
    }))
  ),

  extraSelectors: ({
    selectEvents,
    selectLoading,
    selectEditEvent,
    selectActiveTimeline,
  }) => ({
    isLoading: createSelector(selectLoading, loading => loading),
    selectActiveTimelineViewEvents: createSelector(
      selectEvents,
      selectActiveTimeline,
      (selectEvents, activeTimeline) =>
        selectEvents
          .filter(event => event.timelineId === activeTimeline?.id)
          .map(
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
    selectUploadedImageId: createSelector(
      selectEditEvent,
      selectEditEvent => selectEditEvent?.event?.imageId
    ),
  }),
});
