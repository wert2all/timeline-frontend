import { Component, computed, input, output, signal } from '@angular/core';
import { Pending, Status, Undefined } from '../../../../app.types';
import { LoaderComponent } from '../../../../share/loader/loader.component';
import { UploadQuequeImage } from '../../../../store/images/images.types';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-upload-input',
  templateUrl: './upload-input.component.html',
  imports: [LoaderComponent],
})
export class EditEventFormUploadInputComponent {
  previewImage = input.required<Undefined | UploadQuequeImage>();

  selectFile = output<File>();
  isLoading = computed(() => this.previewImage()?.status === Status.LOADING);
  previewUrl = computed(() => {
    return this.previewImage()?.status === Pending.PENDING
      ? this.selectedFileUrl()
      : null;
  });

  private readonly selectedFileUrl = signal<string | null>(null);

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectFile.emit(input.files![0]);
    this.selectedFileUrl.set(URL.createObjectURL(input.files![0]));
  }
}
