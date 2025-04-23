import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorWarningCircleDuotone } from '@ng-icons/phosphor-icons/duotone';
import { Status } from '../../../../app.types';
import { PreviewHolder } from '../../../dashboard/store/preview/preview.types';

@Component({
  selector: 'app-link-preview',
  standalone: true,
  templateUrl: './link-preview.component.html',
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ phosphorWarningCircleDuotone })],
})
export class LinkPreviewComponent {
  Status = Status;
  preview = input.required<PreviewHolder>();
}
