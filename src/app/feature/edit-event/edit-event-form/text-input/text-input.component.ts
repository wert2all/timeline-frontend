import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditForm } from '../edit-event-form.types';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-text-input',
  templateUrl: './text-input.component.html',
  imports: [ReactiveFormsModule],
})
export class EditFormTextInputComponent {
  form = input.required<FormGroup<EditForm>>();
}
