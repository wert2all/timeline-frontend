import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  signal,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { DateTime } from 'luxon';
import { AddEventButtonComponent } from './add-event-button/add-event-button.component';
import { AddEventFormComponent } from './add-event-form/add-event-form.component';
import { DateComponent } from './event/date/date.component';
import { TagsComponent } from './event/tags/tags.component';
import { UrlComponent } from './event/url/url.component';
import {
  AddValue,
  TimelimeEventType,
  TimelineEvent,
  TimelineEventDraft,
  ViewTimelineDate,
  ViewTimelineEventDraft,
  ViewTimelineEventIcon,
  ViewTimelineTag,
} from './timeline.types';
import { MarkdownContentComponent } from '../../layout/share/markdown-content/markdown-content.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DateComponent,
    NgIconComponent,
    TagsComponent,
    UrlComponent,
    AddEventButtonComponent,
    AddEventFormComponent,
    MarkdownContentComponent,
  ],
})
export class TimelineComponent {
  timelineEventsRaw = signal<TimelineEvent[]>([
    {
      date: new Date('2024-04-07T03:29:00.000+03:00'),
      type: TimelimeEventType.default,
      title: 'we want to create **something** new',
      description: 'may be add **strong** tag',
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
  shouldAddEvent = signal<TimelineEventDraft | null>(null);

  timeline: Signal<ViewTimelineEventDraft[]> = computed(() => {
    return [...[this.shouldAddEvent()], ...this.timelineEventsRaw()]
      .filter(event => !!event)
      .map(event => event as TimelineEvent | TimelineEventDraft)
      .map((event, index) => {
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
          description: event.description || '',
          icon: new ViewTimelineEventIcon(event.type),
          url: this.prepareUrl(event.url),
          date: date,
          changeDirection: index % 2 === 0,
          tags: this.createTags(event.tags),
          draft: this.isDraft(event),
        };
      });
  });

  addEvent() {
    this.shouldAddEvent.set({
      type: TimelimeEventType.default,
      title: '',
      description: '# hello!',
      date: new Date(),
      draft: true,
    });
  }

  filterByTag(tag: ViewTimelineTag) {
    throw new Error('Method not implemented.' + tag);
  }

  valuesChanges(value: AddValue) {
    const newValue: TimelineEventDraft = {
      date: new Date(),
      type: TimelimeEventType.default,
      title: value.title || '...typing',
      description: value.content || undefined,
      showTime: value.withTime || undefined,
      tags: value.tags || undefined,
      draft: true,
    };
    this.shouldAddEvent.set(newValue);
  }

  dismiss() {
    this.shouldAddEvent.set(null);
  }

  private prepareUrl(url: string | undefined) {
    return url ? { title: 'Read more', link: url } : null;
  }

  private createTags(tags: string[] | undefined) {
    return tags?.map(tag => new ViewTimelineTag(tag)) || [];
  }

  private isDraft(event: TimelineEvent | TimelineEventDraft): boolean {
    return (event as TimelineEventDraft).draft !== undefined
      ? (event as TimelineEventDraft).draft
      : false;
  }
}
