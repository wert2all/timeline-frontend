import { Iterable, Loadable, Status, Undefined } from '../../app.types';
import {
  ViewTimelineEventIcon,
  ViewTimelineTag,
  ViewTimelineUrl,
} from '../../feature/timeline/timeline.types';
import { ViewDatetime } from '../../libs/view/date.types';

export enum TimelineEventType {
  default = 'default',
  celebrate = 'celebrate',
}

export type TimelineRequired = {
  date: Date;
  type: TimelineEventType;
  timelineId: number;
};

export type TimelineEvent = TimelineRequired &
  Loadable & {
    id?: number;
    title?: string;
    description?: string;
    showTime?: boolean;
    url?: string;
    tags?: string[];
    imageId?: number;
  };

export type ViewEventImage = {
  imageId: number;
  status: Status;
  title?: string;
  previewUrl?: string;
  url?: string;
};

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

export type ExistTimelineEvent = Iterable & Omit<TimelineEvent, 'id'>;
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
  events: Record<number, ExistTimelineEvent>;
  editEvent: EditEvent | null;
  newTimelineAdded: boolean;
};
