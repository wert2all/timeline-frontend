import { Loadable } from '../../app.types';

export enum TimelimeEventType {
  default = 'default',
  selebrate = 'selebrate',
}
export type TimelineRequired = { date: Date; type: TimelimeEventType };

export type TimelineEvent = TimelineRequired & {
  showTime?: boolean;
  title?: string;
  description?: string;
  url?: string;
  tags?: string[];
};

export type TimelineState = Loadable & {
  events: TimelineEvent[];
};
