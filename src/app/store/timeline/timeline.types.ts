import { Loadable } from '../../app.types';

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

export type TimelineState = Loadable & {
  events: TimelineEvent[];
};
