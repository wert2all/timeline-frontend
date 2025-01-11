import { Component, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoaderComponent } from '../../../../share/loader/loader.component';
import { CurrentUpload } from '../../../../store/images/images.types';
import { EditForm } from '../edit-event-form.types';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-upload-input',
  templateUrl: './upload-input.component.html',
  imports: [LoaderComponent],
})
export class EditEventFormUploadInputComponent {
  form = input.required<FormGroup<EditForm>>();
  previewImage = input.required<CurrentUpload>();

  selectFile = output<File>();

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectFile.emit(input.files![0]);
  }
}
