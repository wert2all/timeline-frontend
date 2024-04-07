import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { IconType, NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { NoAuthorizedLayoutComponent } from '../../../layout/no-authorized/no-authorized-layout.component';

import { Signal } from '@ngrx/signals/src/deep-signal';
import { DateTime } from 'luxon';

import { saxCakeBulk, saxTickCircleBulk } from '@ng-icons/iconsax/bulk';
import { saxLinkOutline } from '@ng-icons/iconsax/outline';

enum TimelimeEventType {
  default = 'default',
  selebrate = 'selebrate',
}

type TimelineRequired = { date: Date; type: TimelimeEventType };

type TimelineEvent = TimelineRequired & {
  title?: string;
  description?: string;
  url?: string;
  tags?: string[];
};

class ViewTimelineEventIcon {
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

class ViewTimelineTag {
  public readonly title: string;
  constructor(title: string) {
    this.title = '#' + title;
  }
}

type ViewTimelineDate = {
  raw: Date;
  withTime: string;
  relative: string | null;
};

type ViewTimelineUrl = { title: string; link: string };
type ViewTimelineEvent = Omit<TimelineEvent, 'date' | 'url' | 'tags'> & {
  icon: ViewTimelineEventIcon;
  date: ViewTimelineDate;
  url: ViewTimelineUrl | null;
  tags: ViewTimelineTag[];
  changeDirection: boolean;
};
@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [CommonModule, NoAuthorizedLayoutComponent, NgIconComponent],
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroCheckCircleSolid, saxLinkOutline })],
})
export class IndexPageComponent {
  timelineEventsRaw = signal<TimelineEvent[]>([
    {
      date: new Date('2024-04-07T03:29:00.000+03:00'),
      type: TimelimeEventType.default,
      title: 'we want to create something new',
    },
    {
      date: new Date('2024-04-06T03:29:00.000+03:00'),
      type: TimelimeEventType.selebrate,
      title: 'first commit to timelime was pushed',
      tags: ['party', 'selebrate', 'start', 'timeline', 'important'],
      description:
        "We made our first commit to our new project. \n The first commit was a small one, but it represents a big step forward for us. It is a testament to the hard work and dedication of our team, who have been working tirelessly to make this project a reality. \n We are excited to continue working on 'timeline' and to share it with the world in the future. We believe that it has the potential to make a real difference in people's lives, and we are committed to making that happen.",
      url: 'https://github.com/wert2all/timeline-frontend/commit/613b8c200ab167c594965751c6c1e6ee6c873dad',
    },
  ]);

  timeline: Signal<ViewTimelineEvent[]> = computed(() => {
    return this.timelineEventsRaw().map((event, index) => {
      const date: ViewTimelineDate = {
        raw: event.date,
        relative: DateTime.fromISO(
          event.date.toISOString()
        ).toRelativeCalendar(),
        withTime: DateTime.fromISO(event.date.toISOString())
          .setLocale('ua')
          .toLocaleString(DateTime.DATETIME_FULL),
      };

      return {
        ...event,
        icon: new ViewTimelineEventIcon(event.type),
        url: this.prepareUrl(event.url),
        date: date,
        changeDirection: index % 2 === 0,
        tags: this.createTags(event.tags),
      };
    });
  });

  private prepareUrl(url: string | undefined) {
    return url ? { title: 'Read more', link: url } : null;
  }
  private createTags(tags: string[] | undefined) {
    return tags?.map(tag => new ViewTimelineTag(tag)) || [];
  }
}
