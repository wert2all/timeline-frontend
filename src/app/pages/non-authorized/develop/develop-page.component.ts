import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Status } from '../../../app.types';
import { dumpLink } from '../../../share/dump.types';
import { TitleComponent } from '../../../share/layout/content/title/title.component';
import { LayoutComponent } from '../../../share/layout/layout.component';
import { PreviewHolder } from '../../../store/preview/preview.types';
import { LinkPreviewComponent } from '../../../widgets/timeline-container/edit-event-form/link-preview/link-preview.component';

@Component({
  selector: 'app-develop-page',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    TitleComponent,
    LinkPreviewComponent,
  ],
  templateUrl: './develop-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopPageComponent {
  dumpLink = signal(new URL(dumpLink));

  dumpPreviewWithError = signal<PreviewHolder>({
    url: dumpLink,
    data: { status: Status.ERROR, error: new Error('some error') },
  });

  dumpPreviewLoading = signal<PreviewHolder>({
    url: dumpLink,
    data: { status: Status.LOADING },
  });

  dumpPreview = signal<PreviewHolder>({
    url: dumpLink,
    data: {
      status: Status.SUCCESS,
      data: {
        image: 'https://img.previewly.top/screenshots/httpswww.thum.io.jpeg',
        title: 'Thum.io | Fast real-time website screenshot API',
      },
    },
  });
}
