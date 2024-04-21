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
import { DatePickerComponent } from '../../../layout/share/date-picker/date-picker.component';
import { AddValue, ViewTimelineTag } from '../timeline.types';
import { AddEventTagsComponent } from './add-event-tags/add-event-tags.component';

@Component({
  selector: 'app-add-event-form',
  standalone: true,
  templateUrl: './add-event-form.component.html',
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
export class AddEventFormComponent {
  activeStep = signal(0);

  addEventForm = inject(FormBuilder).group({
    id: [null],
    date: [DateTime.now().toISODate(), Validators.required],
    time: [DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE)],
    withTime: [false],
    showTime: [true],
    title: [''],
    content: ['# hello!'],
  });

  addedTags = signal<ViewTimelineTag[]>([]);

  @Output() readonly changeValues$: Observable<AddValue>;
  addEvent = output();

  constructor() {
    this.addEventForm.controls.time.disable();
    this.addEventForm.controls.showTime.disable();

    this.changeValues$ = this.addEventForm.valueChanges.pipe(
      map(values => ({
        ...values,
        time: values.time,
        withTime: values.withTime,
        tags: this.addedTags().map(tag => tag.value),
      }))
    );
  }

  addTag(value: string | null) {
    //TODO clean input field
    const tags = value
      ?.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag != '')
      .map(tag => new ViewTimelineTag(tag));
    if (tags) {
      this.addedTags.update(existTags => [...existTags, ...tags]);
    }
  }

  removeTag(tag: ViewTimelineTag) {
    this.addedTags.update(existTags =>
      existTags.filter(existTag => existTag.title !== tag.title)
    );
  }

  handleWithTimeChange() {
    if (this.addEventForm.controls.withTime.value) {
      this.addEventForm.controls.time.enable();
      this.addEventForm.controls.showTime.enable();
    } else {
      this.addEventForm.controls.time.disable();
      this.addEventForm.controls.showTime.disable();
    }
  }

  updateDate(date: Date) {
    this.addEventForm.controls.date.setValue(
      DateTime.fromJSDate(date).toISODate()
    );
  }
}
