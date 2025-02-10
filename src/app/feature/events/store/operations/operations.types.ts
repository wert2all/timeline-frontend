import { Loadable } from '../../../../app.types';
import { TimelineEvent } from '../../../timeline/store/timeline.types';

export type EditableEvent = TimelineEvent & { timelineId: number };
export type EventsState = Loadable & {
  editedEvent: EditableEvent | null;
};
