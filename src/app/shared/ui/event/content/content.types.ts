import { IconType } from '@ng-icons/core';
import {
  phosphorCakeDuotone,
  phosphorCheckCircleDuotone,
} from '@ng-icons/phosphor-icons/duotone';

import { Iterable, Status, Undefined } from '../../../../app.types';
import {
  TimelineEvent,
  TimelineEventType,
} from '../../../../feature/timeline/store/timeline.types';

export interface ViewDatetime {
  originalDate: Date;
  date: string;
  time: string;
  relative: string | null;
}

export class EventContentTag {
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public get title(): string {
    return '#' + this.value;
  }
}

export interface EventContentUrl {
  title: string;
  link: string;
}

export interface EventContentImage {
  imageId: number;
  status: Status;
  title?: string;
  previewUrl?: string;
  url?: string;
}

export class EventContentIcon {
  readonly icon: IconType;

  constructor(type: TimelineEventType) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (type) {
      case TimelineEventType.celebrate:
        this.icon = phosphorCakeDuotone;
        break;
      default:
        this.icon = phosphorCheckCircleDuotone;
    }
  }
}

export type EventContent = Omit<
  TimelineEvent,
  'date' | 'url' | 'tags' | 'description'
> & {
  description: string;
  icon?: EventContentIcon;
  date: ViewDatetime;
  url: EventContentUrl | null;
  tags: EventContentTag[];
  image: Undefined | EventContentImage;
};
export type ExistEventContent = Iterable & Omit<EventContent, 'id'>;
