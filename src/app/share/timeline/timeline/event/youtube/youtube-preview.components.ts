import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { SitePreviewService } from '../../../../../services/site-preview.service';

@Component({
  selector: 'app-timeline-event-yotube-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` @if (preview(); as image) {
    <img [src]="image.image" [alt]="image.title" />
  }`,
})
export class YoutubePreviewComponent {
  private previewService = inject(SitePreviewService);
  url = input<string | undefined>(undefined);
  preview = computed(() => {
    const url = this.url();
    return url ? this.previewService.getPreview(url) : undefined;
  });
}
