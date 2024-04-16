import { IconType } from '@ng-icons/core';
import { saxCakeBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import {
  TimelimeEventType,
  TimelineEvent,
} from '../../store/timeline/timeline.types';

export type TimelineEventDraft = TimelineEvent & {
  draft: true;
};

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
export type ViewTimelineDate = {
  raw: Date;
  date: string;
  showTime: boolean;
  relative: string | null;
};

export class ViewTimelineEventIcon {
  readonly icon: IconType;
  constructor(type: TimelimeEventType) {
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
  icon: ViewTimelineEventIcon;
  date: ViewTimelineDate;
  url: ViewTimelineUrl | null;
  tags: ViewTimelineTag[];
  changeDirection: boolean;
};

export type ViewTimelineEventDraft = ViewTimelineEvent & {
  draft: boolean;
};

export type AddValue = Partial<{
  date: string | null;
  time: string | null;
  withTime: boolean | null;
  showTime: boolean | null;
  title: string | null;
  content: string | null;
  tags: string[];
}>;
