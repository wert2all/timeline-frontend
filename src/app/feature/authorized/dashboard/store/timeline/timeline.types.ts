import { Iterable, Loadable, Undefined } from '../../../../../app.types';
import { TimelineEvent } from '../../../../timeline/store/timeline.types';

export type Timeline = Iterable & { name: string | Undefined };
export type ActiveTimeline = Iterable & { name: string };

// editing event
export type EditEvent = Loadable & {
  event: TimelineEvent | Undefined;
};

// state
export type TimelineState = Loadable & {
  timelines: Timeline[];
  activeTimeline: ActiveTimeline | null;
  newTimelineAdded: boolean;
};
