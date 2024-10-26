import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  Signal,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { DateTime } from 'luxon';
import { EditEventFormComponent } from '../../../widgets/timeline-container/edit-event-form/edit-event-form.component';
import {
  AddValue,
  EditableTimelineEvent,
  EditableTimelineTypes,
  EditableViewTimelineEvent,
  ViewTimelineTag,
} from '../../../widgets/timeline-container/timeline.types';
import { MarkdownContentComponent } from '../../markdown-content/markdown-content.component';
import { EventAdditionalContentComponent } from './event/content/additional/additional-content.component';
import { EventMainContentComponent } from './event/content/main/main-content.component';
import { DateComponent } from './event/date/date.component';
import { IconComponent } from './event/icon/icon.component';
import { TimelineEventMenuComponent } from './event/menu/menu.component';
import { TagsComponent } from './event/tags/tags.component';
import { UrlComponent } from './event/url/url.component';

type EventView = EditableViewTimelineEvent & {
  eventLength: string;
  shouldAccentLine: boolean;
};

@Component({
  selector: 'app-timeline',
  standalone: true,
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
    IconComponent,
    EventMainContentComponent,
    EventAdditionalContentComponent,
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
  onEdit = output<EditableViewTimelineEvent>();

  events: Signal<EventView[]> = computed(() =>
    this.timeline().map(event => ({
      ...event,
      eventLength: 'mb-8',
      shouldAccentLine: event.type === EditableTimelineTypes.draft,
    }))
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
