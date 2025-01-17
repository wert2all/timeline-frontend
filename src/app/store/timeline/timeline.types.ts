import { Iterable, Loadable, Status, Undefined } from '../../app.types';
import {
  ViewTimelineEventIcon,
  ViewTimelineTag,
  ViewTimelineUrl,
} from '../../feature/timeline/timeline.types';
import { ViewDatetime } from '../../libs/view/date.types';
import { TimelineEvent } from '../events/events.types';

export interface ViewEventImage {
  imageId: number;
  status: Status;
  title?: string;
  previewUrl?: string;
  url?: string;
}

export type ViewTimelineEvent = Omit<
  TimelineEvent,
  'date' | 'url' | 'tags' | 'description'
> & {
  description: string;
  icon?: ViewTimelineEventIcon;
  date: ViewDatetime;
  url: ViewTimelineUrl | null;
  tags: ViewTimelineTag[];
  image: Undefined | ViewEventImage;
};

export type ExistViewTimelineEvent = Iterable & Omit<ViewTimelineEvent, 'id'>;

export type Timeline = Iterable & { name: string | null };
export type ActiveTimeline = Iterable & { name: string };

// editing event
export type EditEvent = Loadable & {
  event: TimelineEvent | Undefined;
};

// state
export type TimelineState = Loadable & {
  timelines: Timeline[];
  activeTimeline: ActiveTimeline | null;
  newTimelineAdded: boolean;
};
