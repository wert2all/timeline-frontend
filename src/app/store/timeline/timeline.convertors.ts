import {
  TimelineEvent as GQLTimelineEvent,
  TimelineType as GQLTimelineType,
} from '../../api/internal/graphql';
import { ExistTimelineEvent, TimelineEventType } from './timeline.types';

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
});
//
// export const fromEventTypeStateToApiType = (
//   type: TimelineEventType | EditableTimelineTypes
// ): GQLTimelineType | null => {
//   switch (type) {
//     case TimelineEventType.celebrate:
//       return GQLTimelineType.selebrate;
//     default:
//       return null;
//   }
// };
//
// export const fromEditableEventStateToApiInput = (
//   event: EditableTimelineEvent | null,
//   timelineId: number | null
// ): GQLTimelineEventInput | null => {
//   if (event && timelineId) {
//     return {
//       id: event.id,
//       date: event.date.toISOString(),
//       timelineId: timelineId,
//       type: fromEventTypeStateToApiType(event.type),
//       title: event.title,
//       description: event.description,
//       showTime: event.showTime,
//       url: event.url,
//       tags: event.tags,
//     };
//   } else {
//     return null;
//   }
// };
//
// export const fromEditableEventToTimelineEvent = (
//   event: EditableTimelineEvent
// ): TimelineEvent => ({
//   id: event.id,
//   date: event.date,
//   type: TimelineEventType.default,
//   title: event.title,
//   description: event.description,
//   showTime: event.showTime,
//   url: event.url,
//   loading: true,
//   tags: event.tags,
// });
