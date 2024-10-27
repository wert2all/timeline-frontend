import { IconType } from '@ng-icons/core';
import { saxCakeBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import { TimelineEventType } from '../../store/timeline/timeline.types';

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

  constructor(type: TimelineEventType) {
    switch (type) {
      case TimelineEventType.celebrate:
        this.icon = saxCakeBulk;
        break;
      default:
        this.icon = saxTickCircleBulk;
    }
  }
}
