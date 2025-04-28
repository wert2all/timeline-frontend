import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EventContentConvertor } from '../../../shared/ui/event/content/content.convertor';
import { ExistEventContent } from '../../../shared/ui/event/content/content.types';
import { DeleteEventActions } from '../../dashboard/store/operations/actions/delete-event.actions';
import { EditEventActions } from '../../dashboard/store/operations/actions/edit-event.actions';
import { fromApiEventToState } from '../../dashboard/store/operations/effects/edit-event.effects';
import { ListEventsActions } from '../../timeline/store/actions/list-timeline-events.actions';
import { ShowEventActions } from './actions/show.actions';
import { EventsState } from './events.types';

const initialState: EventsState = {
  loading: false,
  error: null,
  events: [],
  showEvent: null,
};
export const eventsFeature = createFeature({
  name: 'events',
  reducer: createReducer(
    initialState,

    on(
      EditEventActions.emptyEvent,
      EditEventActions.apiException,
      ShowEventActions.errorLoadEvent,
      EditEventActions.successUpdateEvent,
      EditEventActions.successPushNewEvent,
      ShowEventActions.successLoadEvent,
      (state): EventsState => ({
        ...state,
        loading: false,
      })
    ),
    on(
      EditEventActions.pushNewEventToAPI,
      EditEventActions.updateExistEventOnAPI,
      ShowEventActions.loadEvent,
      (state): EventsState => ({
        ...state,
        loading: true,
      })
    ),

    on(
      ShowEventActions.errorLoadEvent,
      (state, { error }): EventsState => ({ ...state, error })
    ),

    on(ShowEventActions.successLoadEvent, (state, { event }): EventsState => {
      return { ...state, showEvent: fromApiEventToState(event) };
    }),

    on(
      ListEventsActions.successLoadTimelineEvents,
      (state, { events }): EventsState => ({
        ...state,
        events: [...state.events, ...events],
      })
    ),

    on(
      DeleteEventActions.confirmToDeleteEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        events: state.events.map(event => ({
          ...event,
          loading: event.id === eventId ? true : event.loading,
        })),
      })
    ),

    on(
      DeleteEventActions.dismissDeleteEvent,
      DeleteEventActions.successDeleteEvent,
      DeleteEventActions.failedDeleteEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        events: state.events.map(event => ({
          ...event,
          loading: event.id === eventId ? false : event.loading,
        })),
      })
    ),

    on(
      DeleteEventActions.successDeleteEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        events: state.events.filter(event => event.id !== eventId),
      })
    ),

    on(
      EditEventActions.saveEditableEvent,
      (state, { event }): EventsState => ({
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
      (state, { event }): EventsState => ({
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
      (state, { event }): EventsState => ({
        ...state,
        events: [event, ...state.events],
      })
    ),

    on(
      EditEventActions.successUpdateEvent,
      (state, { event }): EventsState => ({
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
