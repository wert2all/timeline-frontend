import { Component, signal, AfterViewInit, computed } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxAddOutline,
  saxArrowLeft3Outline,
  saxArrowRight2Outline,
  saxCalendar1Outline,
  saxCalendarAddOutline,
} from '@ng-icons/iconsax/outline';
import { ModalComponent } from '../../layout/share/modal/modal.component';
import { InputComponent } from '../../layout/share/form/input/input.component';
import { TextareaComponent } from '../../layout/share/form/textarea/textarea.component';
import { TagsComponent } from '../timeline/event/tags/tags.component';
import { ViewTimelineTag } from '../timeline/timeline.types';

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
    NgIconComponent,
    ModalComponent,
    InputComponent,
    TextareaComponent,
    TagsComponent,
  ],
})
export class AddEventComponent implements AfterViewInit {
  shouldShow = signal<number>(0);
  activeStep = signal(2);

  steps = computed(() =>
    ['Set date/time', 'Write a content', 'Add tags'].map((title, index) => ({
      isActive: this.activeStep() >= index,
      title: title,
    }))
  );

  title = computed(
    () => 'Add event: ' + this.steps()[this.activeStep()]?.title || ''
  );
  couldAdd = computed(() => true);
  disablePrevious = computed(() => this.activeStep() === 0);
  disableNext = computed(() => this.activeStep() === this.steps().length - 1);
  calendarIcon = saxCalendar1Outline;
  addedTags = signal<ViewTimelineTag[]>([
    new ViewTimelineTag('tag1'),
    new ViewTimelineTag('tag2'),
    new ViewTimelineTag('tag3'),
    new ViewTimelineTag('tag4'),
    new ViewTimelineTag('tag5'),
    new ViewTimelineTag('tag6'),
    new ViewTimelineTag('tag7'),
    new ViewTimelineTag('tag8'),
  ]);

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

  tagKeyPressed($event: string) {
    console.log($event);
  }

  ngAfterViewInit(): void {
    this.showModal();
  }

  private resetForm() {}
}
