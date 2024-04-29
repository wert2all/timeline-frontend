import {
  TimelineEvent as GQLTimelineEvent,
  TimelineEventInput as GQLTimelineEventInput,
  TimelineType as GQLTimelineType,
} from '../../api/internal/graphql';
import {
  EditableTimelineEvent,
  EditableTimelineTypes,
} from '../../widgets/timeline-container/timeline.types';
import { TimelimeEventType, TimelineEvent } from './timeline.types';

export const fromApiTypeToState = (
  type: GQLTimelineType
): TimelimeEventType => {
  switch (type) {
    case GQLTimelineType.default:
      return TimelimeEventType.default;
    case GQLTimelineType.selebrate:
      return TimelimeEventType.selebrate;
    default:
      return TimelimeEventType.default;
  }
};

export const fromApiEventToState = (
  event: GQLTimelineEvent
): TimelineEvent => ({
  id: event.id,
  date: new Date(event.date),
  type: fromApiTypeToState(event.type),
  title: event.title || undefined,
  description: event.description || undefined,
  loading: false,
});

export const fromEventTypeStateToApiType = (
  type: TimelimeEventType | EditableTimelineTypes
): GQLTimelineType | null => {
  switch (type) {
    case TimelimeEventType.selebrate:
      return GQLTimelineType.selebrate;
    default:
      return null;
  }
};

export const fromEditableEventStateToApiInput = (
  event: EditableTimelineEvent | null,
  timelineId: number | null
): GQLTimelineEventInput | null => {
  if (event && timelineId) {
    return {
      id: event.id,
      date: event.date.toISOString(),
      timelineId: timelineId,
      type: fromEventTypeStateToApiType(event.type),
      title: event.title,
      description: event.description,
    };
  } else {
    return null;
  }
};

export const fromEditableEventToTimelineEvent = (
  event: EditableTimelineEvent
): TimelineEvent => ({
  id: event.id,
  date: event.date,
  type: TimelimeEventType.default,
  title: event.title,
  description: event.description,
  showTime: event.showTime,
  loading: true,
});
