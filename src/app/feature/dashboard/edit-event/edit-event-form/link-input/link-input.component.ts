import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Undefined } from '../../../../../app.types';
import { PreviewHolder } from '../../../../dashboard/store/preview/preview.types';
import { EditEventForm } from '../edit-event-form.types';
import { LinkPreviewComponent } from '../link-preview/link-preview.component';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-link-input',
  templateUrl: './link-input.component.html',
  imports: [ReactiveFormsModule, LinkPreviewComponent],
})
export class EditFormLinkInputComponent {
  form = input.required<FormGroup<EditEventForm>>();
  preview = input.required<PreviewHolder | Undefined>();
}
