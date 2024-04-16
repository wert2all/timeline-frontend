import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Output,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxAddOutline,
  saxCalendar1Outline,
  saxCalendarAddOutline,
} from '@ng-icons/iconsax/outline';
import { Observable, map } from 'rxjs';
import { AddValue, ViewTimelineTag } from '../timeline.types';
import { AddEventTagsComponent } from './add-event-tags/add-event-tags.component';
import { DateTime } from 'luxon';

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
  ],
})
export class AddEventFormComponent {
  activeStep = signal(0);

  addEventForm = inject(FormBuilder).group({
    date: [DateTime.now().toISODate(), Validators.required],
    time: [DateTime.now().toISOTime()],
    withTime: [false],
    showTime: [false],
    title: [''],
    content: [''],
  });

  addedTags = signal<ViewTimelineTag[]>([]);

  @Output() public readonly changeValues$: Observable<AddValue>;

  constructor() {
    this.changeValues$ = this.addEventForm.valueChanges.pipe(
      map(values => ({
        ...values,
        time: values.time,
        withTime: values.withTime,
        tags: this.addedTags().map(tag => tag.value),
      }))
    );
  }

  selectDate() {
    throw new Error('Method not implemented.');
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
}
