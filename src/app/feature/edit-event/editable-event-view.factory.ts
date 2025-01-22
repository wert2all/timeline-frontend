import { Status } from '../../app.types';
import {
  ViewTimelineEventIcon,
  ViewTimelineTag,
} from '../../feature/timeline/timeline.types';
import { createViewDatetime } from '../../libs/view/date.functions';
import {
  ExistTimelineEvent,
  TimelineEvent,
  TimelineEventType,
} from '../authorized/dashboard/store/events/events.types';
import { ViewTimelineEvent } from '../authorized/dashboard/store/timeline/timeline.types';

const prepareUrl = (url: string | undefined) => {
  try {
    return url ? { title: new URL(url).host, link: url } : null;
  } catch {
    return null;
  }
};

const createTags = (tags: string[] | undefined) =>
  tags?.map(tag => new ViewTimelineTag(tag)) || [];

export const createDefaultTimelineEvent = (
  timelineId: number
): TimelineEvent => ({
  date: new Date(),
  type: TimelineEventType.default,
  timelineId: timelineId,
  loading: false,
});

export const createViewTimelineEvent = (
  event: TimelineEvent | ExistTimelineEvent
): ViewTimelineEvent => ({
  ...event,
  description: event.description || '',
  icon: new ViewTimelineEventIcon(event.type),
  url: prepareUrl(event.url),
  date: createViewDatetime(event.date, event.showTime || false),
  tags: createTags(event.tags),
  image: event.imageId
    ? { imageId: event.imageId, status: Status.LOADING }
    : undefined,
});
