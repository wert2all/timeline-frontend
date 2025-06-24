import { Component, computed, input, output, signal } from '@angular/core';
import { Pending, Status, Undefined } from '../../../../../app.types';
import { SharedLoaderComponent } from '../../../../../shared/content/loader/loader.component';
import { UploadQuequeImage } from '../../../../../shared/store/images/images.types';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-upload-input',
  templateUrl: './upload-input.component.html',
  imports: [SharedLoaderComponent],
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

  isDraggedOver = signal(false);

  private readonly selectedFileUrl = signal<string | null>(null);

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectFile.emit(input.files![0]);
    this.selectedFileUrl.set(URL.createObjectURL(input.files![0]));
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggedOver.set(true);
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDraggedOver.set(false);
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    this.isDraggedOver.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectFile.emit(files[0]);
      this.selectedFileUrl.set(URL.createObjectURL(files[0]));
    }
  }
}
