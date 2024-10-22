import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { dumpLink } from '../../../share/dump.types';
import { TitleComponent } from '../../../share/layout/content/title/title.component';
import { LayoutComponent } from '../../../share/layout/layout.component';
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
}
