import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Status } from '../../../app.types';
import { createViewDatetime } from '../../../libs/view/date.functions';
import { TimelineActions } from './timeline.actions';
import {
  ExistViewTimelineEvent,
  NewTimelineState,
  ViewTimelineEventIcon,
  ViewTimelineTag,
} from './timeline.types';

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
      TimelineActions.loadTimelineEvents,
      (state): NewTimelineState => ({ ...state, loading: true })
    ),
    on(
      TimelineActions.successLoadTimeline,
      (state): NewTimelineState => ({ ...state, loading: false })
    ),

    on(
      TimelineActions.successLoadTimeline,
      (state, { events, lastCursor, hasMore }) => ({
        ...state,
        events: [...state.events, ...events],
        lastCursor,
        hasMore,
      })
    ),

    on(
      TimelineActions.errorLoadingTimelineEvent,
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
      (events): ExistViewTimelineEvent[] =>
        events.map(event => ({
          ...event,
          description: event.description || '',
          icon: new ViewTimelineEventIcon(event.type),
          url: prepareUrl(event.url),
          date: createViewDatetime(event.date, event.showTime || false),
          tags: event.tags?.map(tag => new ViewTimelineTag(tag)) || [],
          image: event.imageId
            ? { imageId: event.imageId, status: Status.LOADING }
            : undefined,
        }))
    ),
  }),
});
