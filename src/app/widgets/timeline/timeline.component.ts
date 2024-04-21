import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { DateTime } from 'luxon';
import { MarkdownContentComponent } from '../../layout/share/markdown-content/markdown-content.component';
import { AutoAnimateDirective } from '../../libs/auto-animate.directive';
import { TimelineStore } from '../../store/timeline/timeline.store';
import {
  TimelimeEventType,
  TimelineEvent,
} from '../../store/timeline/timeline.types';
import { AddEventButtonComponent } from './add-event-button/add-event-button.component';
import { AddEventFormComponent } from './add-event-form/add-event-form.component';
import { DateComponent } from './event/date/date.component';
import { TagsComponent } from './event/tags/tags.component';
import { UrlComponent } from './event/url/url.component';
import {
  AddValue,
  EditableTimelineEvent,
  EditableTimelineTypes,
  EditableViewTimelineEvent,
  ViewTimelineDate,
  ViewTimelineEventIcon,
  ViewTimelineTag,
} from './timeline.types';

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
    AutoAnimateDirective,
    MarkdownContentComponent,
  ],
})
export class TimelineComponent {
  EditableTimelineTypes = EditableTimelineTypes;

  private readonly timelineStore = inject(TimelineStore);
  private readonly timelineEventsRaw = this.timelineStore.events;
  private readonly shouldAddEvent = signal<EditableTimelineEvent | null>(null);

  canAddNewEvent = computed(() => this.shouldAddEvent() === null);

  timeline: Signal<EditableViewTimelineEvent[]> = computed(() =>
    [...this.createAddList(this.shouldAddEvent()), ...this.timelineEventsRaw()]
      .filter(event => !!event)
      .map(event => event as TimelineEvent | EditableTimelineEvent)
      .map((event, index) => ({
        ...event,
        description: event.description || '',
        icon: new ViewTimelineEventIcon(event.type),
        url: this.prepareUrl(event.url),
        date: this.createDate(event.date, event.showTime || false),
        changeDirection: index % 2 === 0,
        tags: this.createTags(event.tags),
        draft: this.isDraftEvent(event),
      }))
  );

  addEvent() {
    this.shouldAddEvent.set({
      type: EditableTimelineTypes.draft,
      title: '',
      description: '# hello!',
      date: new Date(),
      isEditableType: true,
    });
  }

  filterByTag(tag: ViewTimelineTag) {
    throw new Error('Method not implemented.' + tag);
  }

  valuesChanges(value: AddValue) {
    const date = DateTime.fromISO(
      value.date + (value.time ? 'T' + value.time : '')
    );

    const newValue: EditableTimelineEvent = {
      date: (date.isValid ? date : DateTime.now()).toJSDate(),
      type: EditableTimelineTypes.draft,
      title: value.title || '...typing',
      description: value.content || undefined,
      showTime: (value.withTime && value.showTime) || false,
      tags: value.tags || undefined,
      isEditableType: true,
    };
    this.shouldAddEvent.set(newValue);
  }

  dismiss() {
    this.shouldAddEvent.set(null);
  }

  insertEvent() {
    const viewEvent = this.shouldAddEvent();
    if (viewEvent !== null) {
      const event: TimelineEvent = {
        type: TimelimeEventType.default,
        date: viewEvent.date,
        title: viewEvent.title,
        description: viewEvent.description,
        showTime: viewEvent.showTime,
        tags: viewEvent.tags,
        url: viewEvent.url,
      };
      this.timelineStore.addEvent(event);
    }
    this.shouldAddEvent.set(null);
  }

  private prepareUrl(url: string | undefined) {
    return url ? { title: 'Read more', link: url } : null;
  }

  private createTags(tags: string[] | undefined) {
    return tags?.map(tag => new ViewTimelineTag(tag)) || [];
  }

  private isDraftEvent(event: TimelineEvent | EditableTimelineEvent): boolean {
    return (event as EditableTimelineEvent).isEditableType !== undefined
      ? (event as EditableTimelineEvent).isEditableType
      : false;
  }

  private createDate(date: Date, showTime: boolean): ViewTimelineDate {
    const dateTime = DateTime.fromISO(date.toISOString());

    return {
      relative: showTime
        ? dateTime.toRelative()
        : dateTime.toRelativeCalendar(),
      date:
        dateTime.toLocaleString(DateTime.DATE_SHORT) +
        (showTime
          ? ' ' + dateTime.toLocaleString(DateTime.TIME_24_SIMPLE)
          : ''),
    };
  }

  private createAddList(
    shouldAddValue: EditableTimelineEvent | null
  ): EditableTimelineEvent[] {
    return shouldAddValue
      ? [
          shouldAddValue,
          {
            date: new Date(),
            type: EditableTimelineTypes.delimiter,
            isEditableType: true,
          },
        ]
      : [];
  }
}
