import {
  TimelineEvent,
  TimelineEventType,
} from '../../../timeline/store/timeline.types';

export const createDefaultTimelineEvent = (
  timelineId: number
): TimelineEvent => ({
  date: new Date(),
  type: TimelineEventType.default,
  timelineId: timelineId,
  loading: false,
});
