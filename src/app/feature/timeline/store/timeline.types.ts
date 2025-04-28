import { Iterable, Loadable, StoreState } from '../../../app.types';

export enum TimelineEventType {
  default = 'default',
  celebrate = 'celebrate',
}
export interface TimelineRequired {
  date: Date;
  type: TimelineEventType;
  timelineId: number;
}
export type TimelineEvent = TimelineRequired &
  Loadable & {
    id?: number;
    title?: string;
    description?: string;
    showTime?: boolean;
    url?: string;
    tags?: string[];
    imageId?: number;
  };

export type ExistTimelineEvent = Iterable & Omit<TimelineEvent, 'id'>;

export type Timeline = Iterable & { name: string; accountId: number };

export type TimelineState = StoreState & {
  events: ExistTimelineEvent[];
  timelines: Record<number, Timeline>;
  lastCursor: string | null;
  hasMore: boolean;
};
