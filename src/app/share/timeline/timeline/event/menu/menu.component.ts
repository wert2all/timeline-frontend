import { Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxEditOutline, saxTrashOutline } from '@ng-icons/iconsax/outline';
import { EditableViewTimelineEvent } from '../../../../../widgets/timeline-container/timeline.types';

@Component({
  standalone: true,
  imports: [NgIconComponent],
  selector: 'app-timeline-event-menu',
  templateUrl: './menu.component.html',
  viewProviders: [provideIcons({ saxEditOutline, saxTrashOutline })],
})
export class TimelineEventMenuComponent {
  timelineEvent = input.required<EditableViewTimelineEvent>();

  onDelete = output<EditableViewTimelineEvent>();
  onEdit = output<EditableViewTimelineEvent>();
}
