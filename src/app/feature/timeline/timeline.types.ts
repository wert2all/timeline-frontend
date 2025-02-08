import { IconType } from '@ng-icons/core';
import { saxCakeBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import { Iterable, Status, Undefined } from '../../app.types';
import { ViewDatetime } from '../../libs/view/date.types';
import { TimelineEvent, TimelineEventType } from './store/timeline.types';

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

export class ViewTimelineTag {
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public get title(): string {
    return '#' + this.value;
  }
}

export interface ViewTimelineUrl {
  title: string;
  link: string;
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
