import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  TimelineState,
  TimelineEvent,
  TimelimeEventType,
} from './timeline.types';
import { inject } from '@angular/core';
import { NotificationStore } from '../notifications/notifications.store';

const initialState: TimelineState = {
  loading: false,
  events: [
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
export const TimelineStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, notificationStore = inject(NotificationStore)) => ({
    addEvent: (event: TimelineEvent) => {
      notificationStore.addMessage('event added', 'success');
      patchState(store, state => ({
        ...state,
        events: [event, ...state.events],
      }));
    },
  }))
);
