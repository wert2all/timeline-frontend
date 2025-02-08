import { Loadable, Undefined } from '../../../../app.types';
import { ExistTimelineEvent } from '../../../timeline/store/timeline.types';

export type EventsState = Loadable & {
  events: ExistTimelineEvent[];
  showEditEventId: number | Undefined;
};
