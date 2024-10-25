import {
  TimelimeEventType,
  TimelineEvent,
} from '../store/timeline/timeline.types';
import { ViewTimelineTag } from '../widgets/timeline-container/timeline.types';

export const dumpTitle = 'Dump title';
export const dumpContent = 'Dump content';
export const dumpLink = 'https://www.thum.io/';
export const dumpLinkTitle = 'Link title';
export const dumpDate = new Date('2022-10-21 13:34:40');

export const dumpEvent: TimelineEvent = {
  id: 0,
  date: dumpDate,
  type: TimelimeEventType.youtube,
  loading: false,
};

export const dumpTag: ViewTimelineTag = { value: 'dumpTag', title: '#dumpTag' };
