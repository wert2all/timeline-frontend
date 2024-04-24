import { Iterable, Loadable } from '../../app.types';

export enum TimelimeEventType {
  default = 'default',
  selebrate = 'selebrate',
}

export type TimelineRequired = { date: Date; type: TimelimeEventType };

export type TimelineEvent = TimelineRequired & {
  id?: number;
  title?: string;
  description?: string;
  showTime?: boolean;
  url?: string;
  tags?: string[];
};

export type Timeline = Iterable & { name: string | null };

export type TimelineState = Loadable & {
  timelines: Timeline[];
  activeTimeline: Timeline | null;
  events: TimelineEvent[];
};
