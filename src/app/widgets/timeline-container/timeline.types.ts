import { IconType } from '@ng-icons/core';
import { saxCakeBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import { ViewDatetime } from '../../libs/view/date.types';
import {
  TimelimeEventType,
  TimelineEvent,
} from '../../store/timeline/timeline.types';

export class ViewTimelineTag {
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public get title(): string {
    return '#' + this.value;
  }
}
export type ViewTimelineUrl = { title: string; link: string };

export class ViewTimelineEventIcon {
  readonly icon: IconType;
  constructor(type: TimelimeEventType | EditableTimelineTypes) {
    switch (type) {
      case TimelimeEventType.selebrate:
        this.icon = saxCakeBulk;
        break;
      default:
        this.icon = saxTickCircleBulk;
    }
  }
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
  changeDirection: boolean;
};

export enum EditableTimelineTypes {
  draft = 'draft',
  delimiter = 'delimiter',
}

export type EditableTimelineEvent = Omit<TimelineEvent, 'type'> & {
  type: TimelimeEventType | EditableTimelineTypes;
  isEditableType: boolean;
};

export type EditableViewTimelineEvent = Omit<ViewTimelineEvent, 'type'> & {
  type: TimelimeEventType | EditableTimelineTypes;
};

export type AddValue = Partial<{
  date: string | null;
  time: string | null;
  withTime: boolean | null;
  showTime: boolean | null;
  title: string | null;
  content: string | null;
  url: string | null;
  tags: string[];
}>;
