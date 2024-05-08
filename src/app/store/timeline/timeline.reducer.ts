import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { TimelineEventInput } from '../../api/internal/graphql';
import { EditableTimelineTypes } from '../../widgets/timeline-container/timeline.types';
import { createEditableView } from './editable-event-view.factory';
import { EventActions, TimelineActions } from './timeline.actions';
import {
  fromEditableEventStateToApiInput,
  fromEditableEventToTimelineEvent,
} from './timeline.convertors';
import { TimelimeEventType, TimelineState } from './timeline.types';

const initialState: TimelineState = {
  loading: false,
  preview: null,
  timelines: [],
  activeTimeline: null,
  events: [
    {
      date: new Date('2024-05-08T16:26:00.000+03:00'),
      type: TimelimeEventType.default,
      title: 'remove it immediately!',
      description:
        'if you already used the previous feature that allowed you to add everything to your timeline, now you can delete everything!',
      tags: ['server', 'timeline', 'ui', 'feature'],
      showTime: true,
      loading: false,
    },
    {
      date: new Date('2024-05-06T10:24:00.000+03:00'),
      type: TimelimeEventType.default,
      title: 'it is not enough just to add, you need to get it',
      description:
        'finally! previously you could add your events only, but they began to show in the timeline today',
      tags: ['server', 'timeline', 'ui', 'show me your kung-fu', 'feature'],
      showTime: true,
      loading: false,
    },
    {
      date: new Date('2024-04-17T18:24:00.000+03:00'),
      type: TimelimeEventType.default,
      title: '33ae550a244a4267a3f07862420622fcd4f7498b',
      description: 'The backend server now knows how to authenticate users! ',
      tags: [
        'server',
        'auth',
        'timeline',
        'commit',
        'backend',
        'graphQL',
        'feature',
      ],
      showTime: true,
      loading: false,
    },
    {
      date: new Date('2024-04-17T03:29:00.000+03:00'),
      type: TimelimeEventType.default,
      title: 'first stream ever!',
      description:
        'The first stream where the first lines of the future GraphQL API were written was a blast.\n The stream was a lot of fun, and it was a great way to get the project off the ground. We made a lot of progress in a short amount of time, and we are all very excited about the future of the GraphQL API.',
      tags: ['stream', 'youtube', 'party', 'timeline'],
      url: 'https://www.youtube.com/watch?v=e39HHZiMEH4',
      loading: false,
    },
    {
      date: new Date('2024-04-07T03:29:00.000+03:00'),
      type: TimelimeEventType.default,
      title: 'we want to create **something** new',
      description: 'may be add **strong** tag',
      loading: false,
    },
    {
      date: new Date('2024-04-06T03:29:00.000+03:00'),
      showTime: true,
      type: TimelimeEventType.selebrate,
      title: 'first commit to timelime was pushed',
      tags: ['party', 'selebrate', 'start', 'timeline', 'important'],
      description:
        "We made our first commit to our new project. \n The first commit was a small one, but it represents a big step forward for us. It is a testament to the hard work and dedication of our team, who have been working tirelessly to make this project a reality. \n We are excited to continue working on 'timeline' and to share it with the world in the future. We believe that it has the potential to make a real difference in people's lives, and we are committed to making that happen.",
      url: 'https://github.com/wert2all/timeline-frontend/commit/613b8c200ab167c594965751c6c1e6ee6c873dad',
      loading: false,
    },
  ],
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
      TimelineActions.updateTimelinesAfterAuthorize,
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
      TimelineActions.updateTimelinesAfterAuthorize,
      (state, { timelines }) => ({
        ...state,
        timelines: timelines,
      })
    ),
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
