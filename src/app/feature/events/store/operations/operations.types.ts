import { Loadable } from '../../../../app.types';
import { TimelineEvent } from '../../../timeline/store/timeline.types';

export type EventsState = Loadable & {
  editedEvent: TimelineEvent | null;
};
