import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Output,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxAddOutline,
  saxCalendar1Outline,
  saxCalendarAddOutline,
} from '@ng-icons/iconsax/outline';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';
import { DatePickerComponent } from '../../../../share/date-picker/date-picker.component';
import { AddValue, ViewTimelineTag } from '../../timeline.types';
import { AddEventTagsComponent } from './add-event-tags/add-event-tags.component';

const URL_REGEXP =
  /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;

@Component({
  selector: 'app-edit-event-form',
  standalone: true,
  templateUrl: './edit-event-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      saxAddOutline,
      saxCalendarAddOutline,
      saxCalendar1Outline,
    }),
  ],
  imports: [
    CommonModule,
    NgIconComponent,
    ReactiveFormsModule,
    AddEventTagsComponent,
    DatePickerComponent,
  ],
})
export class EditEventFormComponent {
  activeStep = signal(0);

  form = inject(FormBuilder).group({
    id: [null],
    date: [DateTime.now().toISODate(), Validators.required],
    time: [DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE)],
    withTime: [false],
    showTime: [true],
    title: [''],
    content: ['# hello!'],
    link: [null, [Validators.pattern(URL_REGEXP)]],
  });

  tags = signal<ViewTimelineTag[]>([]);

  @Output() readonly changeValues$: Observable<AddValue>;
  saveEvent = output();

  constructor() {
    this.form.controls.time.disable();
    this.form.controls.showTime.disable();

    this.changeValues$ = this.form.valueChanges.pipe(
      map(values => ({
        ...values,
        time: values.time,
        withTime: values.withTime,
        tags: this.tags().map(tag => tag.value),
        url: values.link,
      }))
    );
  }

  addTag(input: HTMLInputElement) {
    const tags = input.value
      ?.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag != '')
      .map(tag => new ViewTimelineTag(tag));
    if (tags) {
      input.value = '';
      this.tags.update(existTags => [...existTags, ...tags]);
    }
  }

  removeTag(tag: ViewTimelineTag) {
    this.tags.update(existTags =>
      existTags.filter(existTag => existTag.title !== tag.title)
    );
  }

  handleWithTimeChange() {
    if (this.form.controls.withTime.value) {
      this.form.controls.time.enable();
      this.form.controls.showTime.enable();
    } else {
      this.form.controls.time.disable();
      this.form.controls.showTime.disable();
    }
  }

  updateDate(date: Date) {
    this.form.controls.date.setValue(DateTime.fromJSDate(date).toISODate());
  }
}
