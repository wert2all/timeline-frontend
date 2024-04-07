import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { NoAuthorizedLayoutComponent } from '../../../layout/no-authorized/no-authorized-layout.component';

import { DateTime } from 'luxon';

enum TimelimeEventType {
  default = 'default',
  selebrate = 'selebrate',
}

type TimelineEvent = {
  date: Date;
  type: TimelimeEventType;
  title?: string;
  description?: string;
  url?: string;
};
@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [CommonModule, NoAuthorizedLayoutComponent, NgIconComponent],
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroCheckCircleSolid })],
})
export class IndexPageComponent {
  timelineEventsRaw = signal<TimelineEvent[]>([
    {
      date: new Date('2024-04-07T03:29:00.000+03:00'),
      type: TimelimeEventType.default,
      title: ' we want to create something new still',
    },
    {
      date: new Date('2024-04-06T03:29:00.000+03:00'),
      type: TimelimeEventType.selebrate,
      title: 'first commit to timelime was pushed',
      description:
        "We made our first commit to our new project. \n The first commit was a small one, but it represents a big step forward for us. It is a testament to the hard work and dedication of our team, who have been working tirelessly to make this project a reality. \n We are excited to continue working on 'timeline' and to share it with the world in the future. We believe that it has the potential to make a real difference in people's lives, and we are committed to making that happen.",
      url: 'https://github.com/wert2all/timeline-frontend/commit/613b8c200ab167c594965751c6c1e6ee6c873dad',
    },
  ]);

  timeline = computed(() =>
    this.timelineEventsRaw().map((event, index) => ({
      ...event,
      date: {
        raw: event.date,
        relative: DateTime.fromISO(
          event.date.toISOString()
        ).toRelativeCalendar(),
        withTime: DateTime.fromISO(event.date.toISOString())
          .setLocale('ua')
          .toLocaleString(DateTime.DATETIME_FULL),
      },

      changeDirection: index % 2 === 0,
    }))
  );
}
