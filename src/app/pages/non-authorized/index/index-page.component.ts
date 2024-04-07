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

import { Signal } from '@ngrx/signals/src/deep-signal';
import { DateTime } from 'luxon';

import { saxLinkOutline } from '@ng-icons/iconsax/outline';
import {
  TimelimeEventType,
  TimelineEvent,
  ViewTimelineDate,
  ViewTimelineEvent,
  ViewTimelineEventIcon,
  ViewTimelineTag,
} from '../../../components/timeline/timeline.types';
import { TagsComponent } from '../../../components/timeline/event/tags/tags.component';
import { DateComponent } from '../../../components/timeline/event/date/date.component';
import { UrlComponent } from '../../../components/timeline/event/url/url.component';
import { TimelineComponent } from '../../../components/timeline/timeline.component';
import { AddEventComponent } from '../../../components/add-event/add-event.component';

@Component({
  selector: 'app-index-page',
  standalone: true,
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroCheckCircleSolid, saxLinkOutline })],
  imports: [
    CommonModule,
    NoAuthorizedLayoutComponent,
    NgIconComponent,
    TagsComponent,
    DateComponent,
    UrlComponent,
    TimelineComponent,
    AddEventComponent,
  ],
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
      showTime: true,
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
        date: DateTime.fromISO(event.date.toISOString()).toLocaleString(),
        showTime: event.showTime || false,
        time: DateTime.fromISO(event.date.toISOString()).toLocaleString(
          DateTime.TIME_24_SIMPLE
        ),
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

  filterByTag(tag: ViewTimelineTag) {
    throw new Error('Method not implemented.' + tag);
  }

  private prepareUrl(url: string | undefined) {
    return url ? { title: 'Read more', link: url } : null;
  }

  private createTags(tags: string[] | undefined) {
    return tags?.map(tag => new ViewTimelineTag(tag)) || [];
  }
}