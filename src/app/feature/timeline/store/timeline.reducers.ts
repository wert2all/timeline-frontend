import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import { EventContentConvertor } from '../../../shared/ui/event/content/content.convertor';
import { ExistEventContent } from '../../../shared/ui/event/content/content.types';
import { AddTimelineActions } from '../../dashboard/store/operations/actions/add-timeline.actions';
import { DeleteEventActions } from '../../dashboard/store/operations/actions/delete-event.actions';
import { EditEventActions } from '../../dashboard/store/operations/actions/edit-event.actions';
import { ShowEventActions } from '../../events/store/actions/show.actions';
import { ListEventsActions } from './actions/list-timeline-events.actions';
import { LoadTimelinesActions } from './actions/load-timelines.actions';
import { TimelineState as TimelineState } from './timeline.types';

const initialState: TimelineState = {
  loading: false,
  events: [],
  timelines: {},
  error: null,
  lastCursor: null,
  hasMore: false,
  activeAcccountTimelines: [],
};

export const timelineFeature = createFeature({
  name: 'timeline',
  reducer: createReducer(
    initialState,

    on(
      ListEventsActions.loadTimelineEvents,
      LoadTimelinesActions.loadTimeline,
      AddTimelineActions.addTimeline,
      LoadTimelinesActions.loadAccountTimelines,
      (state): TimelineState => ({ ...state, loading: true })
    ),
    on(
      ListEventsActions.successLoadTimelineEvents,
      LoadTimelinesActions.successLoadTimeline,
      AddTimelineActions.successAddTimeline,
      LoadTimelinesActions.successLoadAccountTimelines,
      AddTimelineActions.failedAddTimeline,
      (state): TimelineState => ({ ...state, loading: false })
    ),

    on(
      ListEventsActions.successLoadTimelineEvents,
      (state, { events, lastCursor, hasMore }): TimelineState => ({
        ...state,
        events: [...state.events, ...events],
        lastCursor,
        hasMore,
      })
    ),

    on(DeleteEventActions.confirmToDeleteEvent, (state, { eventId }) => ({
      ...state,
      events: state.events.map(event => ({
        ...event,
        loading: event.id === eventId ? true : event.loading,
      })),
    })),

    on(
      DeleteEventActions.dismissDeleteEvent,
      DeleteEventActions.successDeleteEvent,
      DeleteEventActions.failedDeleteEvent,
      (state, { eventId }) => ({
        ...state,
        events: state.events.map(event => ({
          ...event,
          loading: event.id === eventId ? false : event.loading,
        })),
      })
    ),

    on(DeleteEventActions.successDeleteEvent, (state, { eventId }) => ({
      ...state,
      events: state.events.filter(event => event.id !== eventId),
    })),

    on(
      ListEventsActions.errorLoadingTimelineEvents,
      LoadTimelinesActions.errorLoadTimeline,
      (state, { error }): TimelineState => ({
        ...state,
        loading: false,
        error: error,
      })
    ),

    on(
      EditEventActions.saveEditableEvent,
      (state, { event }): TimelineState => ({
        ...state,
        events: state.events.map(existingEvent =>
          existingEvent.id === event.id
            ? { ...existingEvent, loading: true }
            : existingEvent
        ),
      })
    ),

    on(
      EditEventActions.successUpdateEvent,
      EditEventActions.successPushNewEvent,
      (state, { event }): TimelineState => ({
        ...state,
        events: state.events.map(existingEvent =>
          existingEvent.id === event.id
            ? { ...existingEvent, loading: false }
            : existingEvent
        ),
      })
    ),

    on(
      EditEventActions.successPushNewEvent,
      (state, { event }): TimelineState => ({
        ...state,
        events: [event, ...state.events],
      })
    ),

    on(
      EditEventActions.successUpdateEvent,
      (state, { event }): TimelineState => ({
        ...state,
        events: state.events.map(existingEvent =>
          existingEvent.id === event.id ? event : existingEvent
        ),
      })
    ),

    on(
      LoadTimelinesActions.successLoadTimeline,
      (state, { timeline }): TimelineState => {
        const timelines = { ...state.timelines };
        timelines[timeline.id] = {
          id: timeline.id,
          name: timeline.name || '',
          accountId: timeline.account.id,
        };

        return { ...state, timelines: timelines };
      }
    ),
    on(
      ShowEventActions.successLoadEvent,
      (state, { event }): TimelineState => {
        const timelines = { ...state.timelines };
        timelines[event.timelineId] = {
          id: event.timeline.id,
          name: event.timeline.name || '',
          accountId: event.timeline.account.id,
        };
        return { ...state, timelines };
      }
    ),

    on(
      AddTimelineActions.successAddTimeline,
      (state, { timelines }): TimelineState => ({
        ...state,
        activeAcccountTimelines: [
          ...timelines,
          ...state.activeAcccountTimelines,
        ],
      })
    ),

    on(SharedActions.logout, (): TimelineState => initialState),

    on(
      LoadTimelinesActions.successLoadAccountTimelines,
      (state, { timelines }): TimelineState => ({
        ...state,
        activeAcccountTimelines: timelines.map(timeline => ({
          ...timeline,
          name: timeline.name || '',
        })),
      })
    )
  ),
  extraSelectors: ({ selectEvents }) => ({
    selectViewEvents: createSelector(
      selectEvents,
      (events): ExistEventContent[] => {
        const eventConvertor = new EventContentConvertor();
        return events.map(event => eventConvertor.fromExistEvent(event, null));
      }
    ),
  }),
});
