import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxWarning2Bulk } from '@ng-icons/iconsax/bulk';

import { Status } from '../../../../app.types';
import { PreviewHolder } from '../../../../store/preview/preview.types';

@Component({
  selector: 'app-link-preview',
  standalone: true,
  templateUrl: './link-preview.component.html',
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ saxWarning2Bulk })],
})
export class LinkPreviewComponent {
  Status = Status;
  preview = input.required<PreviewHolder>();
}
