import { Iterable, Loadable, Undefined } from '../../app.types';
import { ViewDatetime } from '../../libs/view/date.types';
import {
  ViewTimelineEventIcon,
  ViewTimelineTag,
  ViewTimelineUrl,
} from '../../widgets/timeline-container/timeline.types';

export enum TimelineEventType {
  default = 'default',
  celebrate = 'celebrate',
  youtube = 'youtube',
}

export type TimelineRequired = { date: Date; type: TimelineEventType };

export type TimelineEvent = TimelineRequired &
  Loadable & {
    id?: number;
    title?: string;
    description?: string;
    showTime?: boolean;
    url?: string;
    tags?: string[];
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
  changeDirection: boolean;
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
  events: ExistTimelineEvent[];
  editEvent: EditEvent | null;
  newTimelineAdded: boolean;
};
