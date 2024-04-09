import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxCloseCircleOutline } from '@ng-icons/iconsax/outline';
import { ViewTimelineTag } from '../../timeline/timeline.types';

@Component({
  selector: 'app-add-event-tags',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './add-event-tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxCloseCircleOutline })],
})
export class AddEventTagsComponent {
  tags = input.required<ViewTimelineTag[]>();
  clickToTag = output<ViewTimelineTag>();
}
