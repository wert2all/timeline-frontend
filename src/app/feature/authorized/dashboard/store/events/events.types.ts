import { Loadable, Undefined } from '../../../../../app.types';
import { ExistTimelineEvent } from '../../../../timeline/store/timeline.types';

export type EventsState = Loadable & {
  events: ExistTimelineEvent[];
  nextCursor: string | Undefined;
  hasNextPage: boolean;
  showEditEventId: number | Undefined;
};

export interface LoadEventActionOptions {
  accountId: number | null;
  timelineId: number;
  cursor: string | Undefined;
}
