import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { TimelineActions } from './timeline.actions';
import { TimelimeEventType, TimelineState } from './timeline.types';

const initialState: TimelineState = {
  loading: false,
  timelines: [],
  activeTimeline: null,
  events: [
    {
      date: new Date('2024-04-17T18:24:00.000+03:00'),
      type: TimelimeEventType.default,
      title: '33ae550a244a4267a3f07862420622fcd4f7498b',
      description: 'The backend server now knows how to authenticate users! ',
      tags: ['server', 'auth', 'timeline', 'commit', 'backend', 'graphQL'],
      showTime: true,
    },
    {
      date: new Date('2024-04-17T03:29:00.000+03:00'),
      type: TimelimeEventType.default,
      title: 'first stream ever!',
      description:
        'The first stream where the first lines of the future GraphQL API were written was a blast.\n The stream was a lot of fun, and it was a great way to get the project off the ground. We made a lot of progress in a short amount of time, and we are all very excited about the future of the GraphQL API.',
      tags: ['stream', 'youtube', 'party', 'timeline'],
      url: 'https://www.youtube.com/watch?v=e39HHZiMEH4',
    },
    {
      date: new Date('2024-04-07T03:29:00.000+03:00'),
      type: TimelimeEventType.default,
      title: 'we want to create **something** new',
      description: 'may be add **strong** tag',
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
    },
  ],
};

export const timelineFeature = createFeature({
  name: 'timeline',
  reducer: createReducer(
    initialState,
    on(
      TimelineActions.updateTimelinesAfterAuthorize,
      (state, { timelines }) => ({
        ...state,
        timelines: timelines,
      })
    )
  ),
  extraSelectors: ({ selectTimelines, selectEvents }) => ({
    selectActiveTimelineEvents: createSelector(
      selectTimelines,
      selectEvents,
      (selectTimeline, selectEvents) => (selectTimeline ? selectEvents : null)
    ),
  }),
});
