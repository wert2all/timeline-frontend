import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Status } from '../../../app.types';
import { createViewDatetime } from '../../../libs/view/date.functions';
import {
  EventContentIcon,
  EventContentTag,
  ExistEventContent,
} from '../../../shared/ui/event/content/content.types';
import { ListEventsActions } from './timeline.actions';
import { NewTimelineState } from './timeline.types';

const initialState: NewTimelineState = {
  loading: false,
  events: [],
  error: null,
  lastCursor: null,
  hasMore: false,
};
const prepareUrl = (url: string | undefined) => {
  try {
    return url ? { title: new URL(url).host, link: url } : null;
  } catch {
    return null;
  }
};

export const timelineFeature = createFeature({
  name: 'new-timeline',
  reducer: createReducer(
    initialState,

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

    on(
      ListEventsActions.errorLoadingTimelineEvents,
      (state, { error }): NewTimelineState => ({
        ...state,
        loading: false,
        error: error,
      })
    )
  ),
  extraSelectors: ({ selectEvents }) => ({
    selectViewEvents: createSelector(
      selectEvents,
      (events): ExistEventContent[] =>
        events.map(event => ({
          ...event,
          description: event.description || '',
          icon: new EventContentIcon(event.type),
          url: prepareUrl(event.url),
          date: createViewDatetime(event.date, event.showTime || false),
          tags: event.tags?.map(tag => new EventContentTag(tag)) || [],
          image: event.imageId
            ? { imageId: event.imageId, status: Status.LOADING }
            : undefined,
        }))
    ),
  }),
});
