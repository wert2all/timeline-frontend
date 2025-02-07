import { Iterable, Loadable, WithError } from '../../../app.types';

export type Event = Iterable & {};
export type NewTimelineState = Loadable &
  WithError & {
    events: Event[];
  };
