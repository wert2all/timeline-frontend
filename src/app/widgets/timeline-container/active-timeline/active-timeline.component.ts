import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { DateTime } from 'luxon';
import { MarkdownContentComponent } from '../../../share/markdown-content/markdown-content.component';
import {
  AddValue,
  EditableTimelineEvent,
  EditableTimelineTypes,
  EditableViewTimelineEvent,
  ViewTimelineTag,
} from '../timeline.types';
import { EditEventFormComponent } from './edit-event-form/edit-event-form.component';
import { DateComponent } from './event/date/date.component';
import { TimelineEventMenuComponent } from './event/menu/menu.component';
import { TagsComponent } from './event/tags/tags.component';
import { UrlComponent } from './event/url/url.component';

@Component({
  selector: 'app-active-timeline',
  standalone: true,
  styleUrl: './active-timeline.component.scss',
  templateUrl: './active-timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UrlComponent,
    MarkdownContentComponent,
    TagsComponent,
    DateComponent,
    EditEventFormComponent,
    TimelineEventMenuComponent,
    NgIconComponent,
  ],
})
export class ActiveTimelineComponent {
  EditableTimelineTypes = EditableTimelineTypes;
  timeline = input.required<EditableViewTimelineEvent[]>();

  filterByTag = output<ViewTimelineTag>();
  formPreview = output<EditableTimelineEvent | null>();
  saveAction = output();
  dismissAction = output();
  onDelete = output<EditableViewTimelineEvent>();

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
