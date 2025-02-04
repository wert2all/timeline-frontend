import { IconType } from '@ng-icons/core';
import { saxCakeBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import { Iterable, Loadable } from '../../app.types';

export interface TimelineRequired {
  date: Date;
  type: TimelineEventType;
  timelineId: number;
}

export enum TimelineEventType {
  default = 'default',
  celebrate = 'celebrate',
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
