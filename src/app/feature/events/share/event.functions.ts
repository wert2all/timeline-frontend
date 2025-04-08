import { Status } from '../../../app.types';
import { createViewDatetime } from '../../../libs/view/date.functions';
import {
  EventContentIcon,
  EventContentTag,
  ExistEventContent,
} from '../../../shared/ui/event/content/content.types';
import { ExistTimelineEvent } from '../../timeline/store/timeline.types';

const prepareUrl = (url: string | undefined) => {
  try {
    return url ? { title: new URL(url).host, link: url } : null;
  } catch {
    return null;
  }
};

export const toEventView = (event: ExistTimelineEvent): ExistEventContent => {
  return {
    ...event,
    description: event.description || '',
    icon: new EventContentIcon(event.type),
    url: prepareUrl(event.url),
    date: createViewDatetime(event.date, event.showTime || false),
    tags: event.tags?.map(tag => new EventContentTag(tag)) || [],
    image: event.imageId
      ? { imageId: event.imageId, status: Status.LOADING }
      : undefined,
  };
};
