import { Iterable, Loadable, StoreState } from '../../../app.types';

export enum EventType {
  default = 'default',
  celebrate = 'celebrate',
}
export interface TimelineRequired {
  date: Date;
  type: EventType;
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
export type EditableEvent = TimelineEvent & { timelineId: number };

export type EventsState = StoreState & {
  events: ExistTimelineEvent[];
  editedEvent: EditableEvent | null;
  showEvent: ExistTimelineEvent | null;
};
