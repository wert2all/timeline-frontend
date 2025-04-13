import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EventContentConvertor } from '../../../../shared/ui/event/content/content.convertor';
import { ExistEventContent } from '../../../../shared/ui/event/content/content.types';
import { TimelineActions } from '../../../authorized/dashboard/store/timeline/timeline.actions';
import { EventOperationsActions } from '../../../events/store/events/actions/operations.actions';
import { ListEventsActions } from '../actions/list-timeline-events.actions';
import { NewTimelineState } from '../timeline.types';

const initialState: NewTimelineState = {
  loading: false,
  events: [],
  error: null,
  lastCursor: null,
  hasMore: false,
};

export const timelineFeature = createFeature({
  name: 'new-timeline',
  reducer: createReducer(
    initialState,

    on(
      TimelineActions.setActiveTimeline,
      (state): NewTimelineState => ({
        ...state,
        events: [],
        hasMore: false,
        lastCursor: null,
      })
    ),

    on(
      ListEventsActions.loadTimelineEvents,
      (state): NewTimelineState => ({ ...state, loading: true })
    ),
    on(
      ListEventsActions.successLoadTimelineEvents,
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
