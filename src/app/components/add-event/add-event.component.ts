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
  imports: [NgIconComponent, ModalComponent, InputComponent, TextareaComponent],
})
export class AddEventComponent implements AfterViewInit {
  shouldShow = signal<number>(0);
  activeStep = signal(1);

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

  ngAfterViewInit(): void {
    this.showModal();
  }

  private resetForm() {}
}
