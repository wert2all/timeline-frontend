import { Loadable, Undefined } from '../../../../../app.types';
import { ExistTimelineEvent } from '../../../../timeline/timeline.types';

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
