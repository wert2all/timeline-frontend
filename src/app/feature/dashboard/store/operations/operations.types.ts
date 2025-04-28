import { Iterable, Loadable } from '../../../../app.types';
import {
  ExistTimelineEvent,
  Timeline,
} from '../../../timeline/store/timeline.types';

export interface Operation {
  name: string;
}

export type CurrentTimeline = Iterable & {
  name: string;
  events: ExistTimelineEvent[];
  hasMore: boolean;
  lastCursor: string | null;
};

export type DashboardOperationsState = Loadable & {
  operations: Operation[];
  currentTimeline: CurrentTimeline | null;
  newTimelineAdded: boolean;
  activeAcccountTimelines: Timeline[];
};
