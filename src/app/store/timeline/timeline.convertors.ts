import {
  TimelineEvent as GQLTimelineEvent,
  TimelineEventInput as GQLTimelineEventInput,
  TimelineType as GQLTimelineType,
} from '../../api/internal/graphql';
import {
  ExistTimelineEvent,
  TimelineEvent,
  TimelineEventType,
} from './timeline.types';

export const fromApiTypeToState = (
  type: GQLTimelineType
): TimelineEventType => {
  switch (type) {
    case GQLTimelineType.default:
      return TimelineEventType.default;
    case GQLTimelineType.selebrate:
      return TimelineEventType.celebrate;
    default:
      return TimelineEventType.default;
  }
};

export const fromApiEventToState = (
  event: GQLTimelineEvent,
  timelineId: number
): ExistTimelineEvent => ({
  id: event.id,
  timelineId: timelineId,
  date: new Date(event.date),
  type: fromApiTypeToState(event.type),
  title: event.title || undefined,
  description: event.description || undefined,
  showTime: event.showTime === true,
  url: event.url || undefined,
  loading: false,
  tags: event.tags || [],
  imageId: event.previewlyImageId || undefined,
});

export const fromEventTypeStateToApiType = (
  type: TimelineEventType
): GQLTimelineType | null => {
  // eslint-disable-next-line  sonarjs/no-small-switch
  switch (type) {
    case TimelineEventType.celebrate:
      return GQLTimelineType.selebrate;
    default:
      return null;
  }
};

export const fromEditableEventStateToApiInput = (
  event: TimelineEvent | ExistTimelineEvent
): GQLTimelineEventInput => ({
  id: event.id,
  date: event.date.toISOString(),
  timelineId: event.timelineId,
  type: fromEventTypeStateToApiType(event.type),
  title: event.title,
  description: event.description,
  showTime: event.showTime,
  url: event.url,
  tags: event.tags,
  previewlyImageId: event.imageId,
});
