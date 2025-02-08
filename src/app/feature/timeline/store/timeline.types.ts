import { IconType } from '@ng-icons/core';
import { saxCakeBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import {
  Iterable,
  Loadable,
  Status,
  StoreState,
  Undefined,
} from '../../../app.types';
import { ViewDatetime } from '../../../libs/view/date.types';

export class ViewTimelineTag {
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public get title(): string {
    return '#' + this.value;
  }
}

export class ViewTimelineEventIcon {
  readonly icon: IconType;

  constructor(type: TimelineEventType) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (type) {
      case TimelineEventType.celebrate:
        this.icon = saxCakeBulk;
        break;
      default:
        this.icon = saxTickCircleBulk;
    }
  }
}

export interface ViewTimelineUrl {
  title: string;
  link: string;
}

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

export enum TimelineEventType {
  default = 'default',
  celebrate = 'celebrate',
}
export interface TimelineRequired {
  date: Date;
  type: TimelineEventType;
  timelineId: number;
}
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

export type ExistTimelineEvent = Iterable & Omit<TimelineEvent, 'id'>;
export type ExistViewTimelineEvent = Iterable & Omit<ViewTimelineEvent, 'id'>;

export type NewTimelineState = StoreState & {
  events: ExistTimelineEvent[];
  lastCursor: string | null;
  hasMore: boolean;
};
