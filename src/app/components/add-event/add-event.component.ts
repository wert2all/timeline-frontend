import { CommonModule } from '@angular/common';
import { Component, Output, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxAddOutline,
  saxArrowLeft3Outline,
  saxArrowRight2Outline,
  saxCalendar1Outline,
  saxCalendarAddOutline,
} from '@ng-icons/iconsax/outline';
import { ModalComponent } from '../../layout/share/modal/modal.component';
import { TagsComponent } from '../timeline/event/tags/tags.component';
import { ViewTimelineTag } from '../timeline/timeline.types';
import { AddEventTagsComponent } from './add-event-tags/add-event-tags.component';

@Component({
  selector: 'app-add-event',
  standalone: true,
  templateUrl: './add-event.component.html',
  providers: [
    provideIcons({
      saxAddOutline,
      saxCalendarAddOutline,
      saxArrowRight2Outline,
      saxArrowLeft3Outline,
      saxCalendar1Outline,
    }),
  ],
  imports: [
    CommonModule,
    NgIconComponent,
    ModalComponent,
    TagsComponent,
    ReactiveFormsModule,
    AddEventTagsComponent,
  ],
})
export class AddEventComponent {
  shouldShow = signal<number>(0);
  activeStep = signal(0);

  steps = computed(() =>
    ['Set date/time', 'Write a content', 'Add tags'].map((title, index) => ({
      isActive: this.activeStep() >= index,
      title: title,
    }))
  );

  addEventForm = inject(FormBuilder).group({
    date: ['', Validators.required],
    addTime: [false],
    time: [''],
    showTime: [false],
    title: [''],
    content: [''],
    tag: [''],
  });

  title = computed(
    () => 'Add event: ' + this.steps()[this.activeStep()]?.title || ''
  );

  disablePrevious = computed(() => this.activeStep() === 0);
  disableNext = computed(() => this.activeStep() === this.steps().length - 1);
  calendarIcon = saxCalendar1Outline;
  addedTags = signal<ViewTimelineTag[]>([]);

  @Output() valueChanges = this.addEventForm.valueChanges;

  showModal() {
    this.resetForm();
    this.shouldShow.set(window.performance.now());
  }

  goNext() {
    if (!this.disableNext()) {
      this.activeStep.update(step => ++step);
    }
  }

  goPrevious() {
    if (!this.disablePrevious()) {
      this.activeStep.update(step => --step);
    }
  }

  onClosed() {
    console.log('closed');
  }

  selectDate() {
    throw new Error('Method not implemented.');
  }

  addTag() {
    const tags = this.addEventForm
      .get('tag')
      ?.value?.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag != '')
      .map(tag => new ViewTimelineTag(tag));
    if (tags) {
      this.addedTags.update(existTags => [...existTags, ...tags]);
    }
    this.addEventForm.get('tag')?.reset();
  }

  removeTag(tag: ViewTimelineTag) {
    this.addedTags.update(existTags =>
      existTags.filter(existTag => existTag.title !== tag.title)
    );
  }
  private resetForm() {}
}
