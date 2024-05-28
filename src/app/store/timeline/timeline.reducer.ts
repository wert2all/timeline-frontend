import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { TimelineEventInput } from '../../api/internal/graphql';
import { EditableTimelineTypes } from '../../widgets/timeline-container/timeline.types';
import { createEditableView } from './editable-event-view.factory';
import { EventActions, TimelineActions } from './timeline.actions';
import {
  fromEditableEventStateToApiInput,
  fromEditableEventToTimelineEvent,
} from './timeline.convertors';
import { TimelineState } from './timeline.types';

const initialState: TimelineState = {
  loading: false,
  preview: null,
  timelines: [],
  activeTimeline: null,
  events: [],
  newTimelineAdded: false,
};

export const timelineFeature = createFeature({
  name: 'timeline',
  reducer: createReducer(
    initialState,
    on(
      TimelineActions.addTimeline,
      TimelineActions.addTimelineAfterLogin,
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

    on(EventActions.addEvent, state => ({
      ...state,
      events: [
        ...(state.preview ? [state.preview] : []).map(event =>
          fromEditableEventToTimelineEvent(event)
        ),
        ...state.events,
      ],
    })),
    on(EventActions.successPushEvent, (state, { addedEvent }) => ({
      ...state,
      events: [...[addedEvent], ...state.events],
    })),
    on(
      EventActions.successPushEvent,
      EventActions.emptyEvent,
      EventActions.apiException,
      state => ({
        ...state,
        events: state.events.filter(event => !event.loading),
      })
    ),

    on(EventActions.successLoadActiveTimelineEvents, (state, { events }) => ({
      ...state,
      events: [...events, ...state.events],
    })),

    on(
      TimelineActions.successAddTimeline,
      TimelineActions.successAddTimelineAfterLogin,
      state => ({ ...state, newTimelineAdded: true })
    ),

    on(EventActions.createPreview, state => ({
      ...state,
      preview: {
        type: EditableTimelineTypes.draft,
        title: '',
        description: '# hello!',
        date: new Date(),
        isEditableType: true,
        loading: false,
      },
    })),
    on(EventActions.updatePreview, (state, { event }) => ({
      ...state,
      preview: event,
    })),
    on(
      EventActions.cleanPreview,
      EventActions.cleanPreviewAfterPushEvent,
      state => ({ ...state, preview: null })
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
    }))
  ),
  extraSelectors: ({
    selectEvents,
    selectActiveTimeline,
    selectLoading,
    selectPreview,
  }) => ({
    isLoading: createSelector(selectLoading, loading => loading),
    selectEditableEvents: createSelector(
      selectActiveTimeline,
      selectEvents,
      selectPreview,
      (selectActiveTimeline, selectEvents, selectPreview) =>
        createEditableView(
          selectActiveTimeline ? selectEvents : [],
          selectPreview
        )
    ),
    selectEventForPush: createSelector(
      selectPreview,
      selectActiveTimeline,
      (selectPreview, selectActiveTimeline): TimelineEventInput | null =>
        fromEditableEventStateToApiInput(
          selectPreview,
          selectActiveTimeline?.id || null
        )
    ),
  }),
});
