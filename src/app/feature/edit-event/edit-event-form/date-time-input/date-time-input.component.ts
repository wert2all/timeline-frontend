import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { DatePickerComponent } from '../../../../shared/date-picker/date-picker.component';
import { EditEventForm } from '../edit-event-form.types';

@Component({
  selector: 'app-edit-event-form-date-time-input',
  templateUrl: './date-time-input.component.html',
  imports: [DatePickerComponent, ReactiveFormsModule],
})
export class EditFormDateTimeInputComponent {
  form = input.required<FormGroup<EditEventForm>>();

  updateDate(date: Date) {
    this.form().controls.date.setValue(DateTime.fromJSDate(date).toISODate());
  }
}
