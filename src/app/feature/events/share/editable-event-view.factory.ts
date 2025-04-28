import { EventType, TimelineEvent } from '../store/events.types';

export const createDefaultTimelineEvent = (
  timelineId: number
): TimelineEvent => ({
  date: new Date(),
  type: EventType.default,
  timelineId: timelineId,
  loading: false,
});
