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
export type NewTimelineState = StoreState & {
  events: ExistTimelineEvent[];
};
