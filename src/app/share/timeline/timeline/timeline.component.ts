import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  input,
  output,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { DateTime } from 'luxon';
import {
  AddValue,
  EditableTimelineEvent,
  EditableTimelineTypes,
  EditableViewTimelineEvent,
  ViewTimelineTag,
} from '../../../widgets/timeline-container/timeline.types';
import { MarkdownContentComponent } from '../../markdown-content/markdown-content.component';
import { DateComponent } from './event/date/date.component';
import { TimelineEventMenuComponent } from './event/menu/menu.component';
import { TagsComponent } from './event/tags/tags.component';
import { UrlComponent } from './event/url/url.component';
import { EditEventFormComponent } from '../../../widgets/timeline-container/edit-event-form/edit-event-form.component';
type EventView = EditableViewTimelineEvent & { eventLength: string };
@Component({
  selector: 'app-timeline',
  standalone: true,
  styleUrl: './timeline.component.scss',
  templateUrl: './timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UrlComponent,
    MarkdownContentComponent,
    TagsComponent,
    DateComponent,
    TimelineEventMenuComponent,
    NgIconComponent,
    EditEventFormComponent,
  ],
})
export class TimelineComponent {
  EditableTimelineTypes = EditableTimelineTypes;
  timeline = input.required<EditableViewTimelineEvent[]>();

  filterByTag = output<ViewTimelineTag>();
  formPreview = output<EditableTimelineEvent | null>();
  saveAction = output();
  dismissAction = output();
  onDelete = output<EditableViewTimelineEvent>();

  events: Signal<EventView[]> = computed(() =>
    this.timeline().map(event => ({ ...event, eventLength: 'mb-8' }))
  );

  valuesChanges(value: AddValue) {
    const time = value.time?.match('^\\d:') ? '0' + value.time : value.time;
    const date = DateTime.fromISO(value.date + (time ? 'T' + time : ''));

    const newValue: EditableTimelineEvent = {
      date: (date.isValid ? date : DateTime.now()).toJSDate(),
      type: EditableTimelineTypes.draft,
      title: value.title || '',
      description: value.content || undefined,
      showTime: (value.withTime && value.showTime) || false,
      tags: value.tags || undefined,
      isEditableType: true,
      url: value.url || undefined,
      loading: false,
    };

    this.formPreview.emit(newValue);
  }
}