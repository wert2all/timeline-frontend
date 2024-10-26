import { createViewDatetime } from '../../libs/view/date.functions';
import {
  EditableTimelineEvent,
  EditableTimelineTypes,
  EditableViewTimelineEvent,
  ViewTimelineEventIcon,
  ViewTimelineTag,
} from '../../widgets/timeline-container/timeline.types';
import { TimelineEvent } from './timeline.types';

const createPreviewEvent = (preview: EditableTimelineEvent | null) =>
  preview
    ? [
        preview,
        {
          date: new Date(),
          type: EditableTimelineTypes.delimiter,
          isEditableType: true,
          loading: false,
        },
      ]
    : [];

const prepareUrl = (url: string | undefined) => {
  try {
    return url ? { title: new URL(url).host, link: url } : null;
  } catch {
    return null;
  }
};

const createTags = (tags: string[] | undefined) =>
  tags?.map(tag => new ViewTimelineTag(tag)) || [];

const isDraftEvent = (event: TimelineEvent | EditableTimelineEvent): boolean =>
  (event as EditableTimelineEvent).isEditableType !== undefined
    ? (event as EditableTimelineEvent).isEditableType
    : false;

export const createEditableView = (
  events: TimelineEvent[],
  preview: EditableTimelineEvent | null
): EditableViewTimelineEvent[] =>
  [...createPreviewEvent(preview), ...events]
    .filter(event => !!event)
    .map((event, index) => ({
      ...event,
      description: event.description || '',
      icon: new ViewTimelineEventIcon(event.type),
      url: prepareUrl(event.url),
      date: createViewDatetime(event.date, event.showTime || false),
      changeDirection: index % 2 === 0,
      tags: createTags(event.tags),
      draft: isDraftEvent(event),
      isEditableType: true,
    }));
