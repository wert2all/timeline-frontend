import {
  Component,
  Signal,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DataWrapper, Status } from '../../app.types';
import {
  Preview,
  SitePreviewService,
} from '../../services/site-preview.service';

@Component({
  selector: 'app-link-preview',
  standalone: true,
  templateUrl: './link-preview.component.html',
})
export class LinkPreviewComponent {
  Status = Status;
  private previewService = inject(SitePreviewService);
  link = input.required<URL>();

  error = signal<Error | undefined>(undefined);

  preview = computed(() => this.previewService.getPreview(this.link().href));

  previewWrapper: Signal<DataWrapper<Preview>> = computed(() => {
    if (this.error() !== undefined) {
      return { status: Status.ERROR, error: this.error() };
    }
    if (this.preview() !== undefined) {
      return { status: Status.SUCCESS, data: this.preview() };
    } else {
      return { status: Status.LOADING };
    }
  });
}
