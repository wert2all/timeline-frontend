import { DateTime } from 'luxon';
import {
  EditableTimelineEvent,
  EditableTimelineTypes,
  ViewTimelineDate,
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

const createDate = (date: Date, showTime: boolean): ViewTimelineDate => {
  const dateTime = DateTime.fromISO(date.toISOString());

  return {
    relative: showTime ? dateTime.toRelative() : dateTime.toRelativeCalendar(),
    date:
      dateTime.toLocaleString(DateTime.DATE_SHORT) +
      (showTime ? ' ' + dateTime.toLocaleString(DateTime.TIME_24_SIMPLE) : ''),
  };
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
) =>
  [...createPreviewEvent(preview), ...events]
    .filter(event => !!event)
    .map((event, index) => ({
      ...event,
      description: event.description || '',
      icon: new ViewTimelineEventIcon(event.type),
      url: prepareUrl(event.url),
      date: createDate(event.date, event.showTime || false),
      changeDirection: index % 2 === 0,
      tags: createTags(event.tags),
      draft: isDraftEvent(event),
    }));
