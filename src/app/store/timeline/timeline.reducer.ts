import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Status } from '../../app.types';
import { updateStateRecord } from '../../libs/state.functions';
import { AuthActions } from '../auth/auth.actions';
import { UploadActions } from '../images/images.actions';
import {
  createDefaultTimelineEvent,
  createViewTimelineEvent,
} from './editable-event-view.factory';
import { EventActions, TimelineActions } from './timeline.actions';
import {
  ExistTimelineEvent,
  ExistViewTimelineEvent,
  TimelineState,
} from './timeline.types';

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
      events: updateStateRecord(
        state.events,
        Object.values(state.events).filter(event => event.loading)
      ),
    })),

    on(
      EventActions.successLoadTimelineEvents,
      EventActions.successUpdateEvent,
      EventActions.successPushNewEvent,
      (state, { events }) => ({
        ...state,
        events: updateStateRecord(state.events, events),
      })
    ),

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
        editEvent:
          eventId && state.events[eventId]
            ? { event: state.events[eventId], loading: false }
            : null,
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

    on(EventActions.deleteEvent, (state, { eventId }) =>
      state.events[eventId]
        ? {
            ...state,
            events: updateStateRecord<ExistTimelineEvent>(state.events, [
              { ...state.events[eventId], loading: true },
            ]),
          }
        : state
    ),

    on(EventActions.successDeleteEvent, (state, { eventId }) =>
      state.events[eventId]
        ? {
            ...state,
            events: Object.values(state.events)
              .filter(event => event.id !== eventId)
              .reduce((acc: Record<number, ExistTimelineEvent>, event) => {
                acc[event.id] = event;
                return acc;
              }, {}),
          }
        : state
    ),

    on(EventActions.failedDeleteEvent, (state, { eventId }) =>
      state.events[eventId]
        ? {
            ...state,
            events: updateStateRecord(state.events, [
              { ...state.events[eventId], loading: false },
            ]),
          }
        : state
    ),

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
        Object.values(selectEvents)
          .filter(event => event.timelineId === activeTimeline?.id)
          .map(
            (event): ExistViewTimelineEvent => ({
              ...createViewTimelineEvent(event),
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
