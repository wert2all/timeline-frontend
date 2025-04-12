import { StoreState } from '../../../app.types';
import {
  ExistTimelineEvent,
  TimelineEvent,
} from '../../timeline/store/timeline.types';

export type EditableEvent = TimelineEvent & { timelineId: number };

export type EventsState = StoreState & {
  editedEvent: EditableEvent | null;
  showEvent: ExistTimelineEvent | null;
};
