import { Iterable, StoreState } from '../../../app.types';

export type Timeline = Iterable & { name: string; accountId: number };

export type TimelineState = StoreState & {
  timelines: Record<number, Timeline>;
  lastCursor: string | null;
  hasMore: boolean;
};
