import { IconType } from '@ng-icons/core';
import { saxCakeBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';

export enum TimelimeEventType {
  default = 'default',
  selebrate = 'selebrate',
}

export type TimelineRequired = { date: Date; type: TimelimeEventType };

export type TimelineEvent = TimelineRequired & {
  showTime?: boolean;
  title?: string;
  description?: string;
  url?: string;
  tags?: string[];
};

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
  time: string;
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

export type ViewTimelineEvent = Omit<TimelineEvent, 'date' | 'url' | 'tags'> & {
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
