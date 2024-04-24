import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DateTime } from 'luxon';

import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { TimelineActions } from '../../store/timeline/timeline.actions';
import { timelineFeature } from '../../store/timeline/timeline.reducer';
import {
  TimelimeEventType,
  TimelineEvent,
} from '../../store/timeline/timeline.types';
import { ActiveTimelineComponent } from './active-timeline/active-timeline.component';
import { AddEventButtonComponent } from './add-event-button/add-event-button.component';
import {
  EditableTimelineEvent,
  EditableTimelineTypes,
  EditableViewTimelineEvent,
  ViewTimelineDate,
  ViewTimelineEventIcon,
  ViewTimelineTag,
} from './timeline.types';
@Component({
  selector: 'app-timeline-container',
  templateUrl: './timeline-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, AddEventButtonComponent, ActiveTimelineComponent],
})
export class TimelineComponent {
  private store = inject(Store);

  private readonly timelineEventsRaw = this.store.selectSignal(
    timelineFeature.selectActiveTimelineEvents
  );
  readonly shouldAddEvent = signal<EditableTimelineEvent | null>(null);

  activeTimeline = this.store.select(timelineFeature.selectActiveTimeline);

  canAddNewEvent = computed(() => this.shouldAddEvent() === null);

  timeline: Signal<EditableViewTimelineEvent[]> = computed(() =>
    this.timelineEventsRaw()
      ? [
          ...this.createAddList(this.shouldAddEvent()),
          ...this.timelineEventsRaw()!,
        ]
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
      : []
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
      this.store.dispatch(TimelineActions.addEvent({ event: event }));
    }
    this.shouldAddEvent.set(null);
  }

  private prepareUrl(url: string | undefined) {
    return url ? { title: new URL(url).host, link: url } : null;
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
