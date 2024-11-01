import { Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxEditOutline, saxTrashOutline } from '@ng-icons/iconsax/outline';
import { Iterable } from '../../../../../app.types';
import { FeatureFlagComponent } from '../../../../flag/feature-flag/feature-flag.component';

@Component({
  standalone: true,
  imports: [NgIconComponent, FeatureFlagComponent],
  selector: 'app-timeline-event-menu',
  templateUrl: './menu.component.html',
  viewProviders: [provideIcons({ saxEditOutline, saxTrashOutline })],
})
export class TimelineEventMenuComponent {
  timelineEvent = input.required<Iterable>();

  onDelete = output<Iterable>();
  onEdit = output<Iterable>();
}
