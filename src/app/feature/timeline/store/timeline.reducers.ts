import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import { EventContentConvertor } from '../../../shared/ui/event/content/content.convertor';
import { ExistEventContent } from '../../../shared/ui/event/content/content.types';
import { EventOperationsActions } from '../../events/store/actions/operations.actions';
import { ShowEventActions } from '../../events/store/actions/show.actions';
import { AddTimelineActions } from './actions/add-timeline.actions';
import { ListEventsActions } from './actions/list-timeline-events.actions';
import { LoadTimelinesActions } from './actions/load-timelines.actions';
import { SetActiveTimelineActions } from './actions/set-active.actions';
import { NewTimelineState } from './timeline.types';

const initialState: NewTimelineState = {
  loading: false,
  events: [],
  timelines: {},
  error: null,
  lastCursor: null,
  hasMore: false,
  activeTimeline: null,
  newTimelineAdded: false,
  activeAcccountTimelines: [],
};

export const timelineFeature = createFeature({
  name: 'timeline',
  reducer: createReducer(
    initialState,

    on(
      SetActiveTimelineActions.setActiveTimeline,
      (state): NewTimelineState => ({
        ...state,
        events: [],
        hasMore: false,
        lastCursor: null,
      })
    ),

    on(
      ListEventsActions.loadTimelineEvents,
      LoadTimelinesActions.loadTimeline,
      AddTimelineActions.addTimeline,
      LoadTimelinesActions.loadAccountTimelines,
      (state): NewTimelineState => ({ ...state, loading: true })
    ),
    on(
      ListEventsActions.successLoadTimelineEvents,
      LoadTimelinesActions.successLoadTimeline,
      AddTimelineActions.successAddTimeline,
      LoadTimelinesActions.successLoadAccountTimelines,
      AddTimelineActions.emptyTimeline,
      AddTimelineActions.apiException,
      (state): NewTimelineState => ({ ...state, loading: false })
    ),

    on(
      ListEventsActions.successLoadTimelineEvents,
      (state, { events, lastCursor, hasMore }): NewTimelineState => ({
        ...state,
        events: [...state.events, ...events],
        lastCursor,
        hasMore,
      })
    ),

    on(EventOperationsActions.confirmToDeleteEvent, (state, { eventId }) => ({
      ...state,
      events: state.events.map(event => ({
        ...event,
        loading: event.id === eventId ? true : event.loading,
      })),
    })),

    on(
      EventOperationsActions.dismissDeleteEvent,
      EventOperationsActions.successDeleteEvent,
      EventOperationsActions.failedDeleteEvent,
      (state, { eventId }) => ({
        ...state,
        events: state.events.map(event => ({
          ...event,
          loading: event.id === eventId ? false : event.loading,
        })),
      })
    ),

    on(EventOperationsActions.successDeleteEvent, (state, { eventId }) => ({
      ...state,
      events: state.events.filter(event => event.id !== eventId),
    })),

    on(
      ListEventsActions.errorLoadingTimelineEvents,
      LoadTimelinesActions.errorLoadTimeline,
      (state, { error }): NewTimelineState => ({
        ...state,
        loading: false,
        error: error,
      })
    ),

    on(
      EventOperationsActions.saveEditableEvent,
      (state, { event }): NewTimelineState => ({
        ...state,
        events: state.events.map(existingEvent =>
          existingEvent.id === event.id
            ? { ...existingEvent, loading: true }
            : existingEvent
        ),
      })
    ),

    on(
      EventOperationsActions.successUpdateEvent,
      EventOperationsActions.successPushNewEvent,
      (state, { event }): NewTimelineState => ({
        ...state,
        events: state.events.map(existingEvent =>
          existingEvent.id === event.id
            ? { ...existingEvent, loading: false }
            : existingEvent
        ),
      })
    ),

    on(
      EventOperationsActions.successPushNewEvent,
      (state, { event }): NewTimelineState => ({
        ...state,
        events: [event, ...state.events],
      })
    ),

    on(
      EventOperationsActions.successUpdateEvent,
      (state, { event }): NewTimelineState => ({
        ...state,
        events: state.events.map(existingEvent =>
          existingEvent.id === event.id ? event : existingEvent
        ),
      })
    ),

    on(
      LoadTimelinesActions.successLoadTimeline,
      (state, { timeline }): NewTimelineState => {
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
      (state, { event }): NewTimelineState => {
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
      SetActiveTimelineActions.setActiveTimeline,
      (state, { timeline }): NewTimelineState => ({
        ...state,
        activeTimeline: {
          name: timeline.name || '',
          id: timeline.id,
        },
      })
    ),

    on(
      AddTimelineActions.successAddTimeline,
      (state): NewTimelineState => ({
        ...state,
        newTimelineAdded: true,
      })
    ),

    on(
      AddTimelineActions.successAddTimeline,
      (state, { timelines }): NewTimelineState => ({
        ...state,
        activeAcccountTimelines: [
          ...timelines,
          ...state.activeAcccountTimelines,
        ],
      })
    ),

    on(SharedActions.logout, (): NewTimelineState => initialState),

    on(
      LoadTimelinesActions.successLoadAccountTimelines,
      (state, { timelines }): NewTimelineState => ({
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
