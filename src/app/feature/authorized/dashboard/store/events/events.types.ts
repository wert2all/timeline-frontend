import { Iterable, Loadable, Undefined } from '../../../../../app.types';

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

export type EventsState = Loadable & {
  events: ExistTimelineEvent[];
  nextCursor: string | Undefined;
  hasNextPage: boolean;
  showEditEventId: number | Undefined;
};

export interface LoadEventActionOptions {
  accountId: number;
  timelineId: number;
  cursor: string | Undefined;
}
