import { Iterable, StoreState } from '../../../app.types';
import { ExistTimelineEvent } from '../../events/store/events.types';

export type Timeline = Iterable & { name: string; accountId: number };

export type TimelineState = StoreState & {
  events: ExistTimelineEvent[];
  timelines: Record<number, Timeline>;
  lastCursor: string | null;
  hasMore: boolean;
};
