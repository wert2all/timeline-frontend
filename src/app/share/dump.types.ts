import { ViewTimelineTag } from '../feature/timeline/timeline.types';
import {
  TimelineEvent,
  TimelineEventType,
} from '../store/timeline/timeline.types';

export const dumpTitle = 'Dump title';
export const dumpContent = '# Hello, Neptune!';
export const dumpLink = 'https://www.thum.io/';
export const dumpLinkTitle = 'Link title';
export const dumpDate = new Date('2022-10-21 13:34:40');
export const dumpTag: ViewTimelineTag = { value: 'dumpTag', title: '#dumpTag' };

export const dumpEvent: TimelineEvent = {
  id: 0,
  timelineId: 0,
  date: dumpDate,
  type: TimelineEventType.default,
  title: dumpTitle,
  description: dumpContent,
  showTime: true,
  url: dumpLink,
  tags: [dumpTag.value, dumpTag.value],
  loading: false,
};
