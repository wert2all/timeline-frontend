import { Component, input } from '@angular/core';
import { EditableViewTimelineEvent } from '../../timeline.types';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxEditOutline, saxTrashOutline } from '@ng-icons/iconsax/outline';

@Component({
  standalone: true,
  imports: [NgIconComponent],
  selector: 'app-timeline-event-menu',
  templateUrl: './menu.component.html',
  viewProviders: [provideIcons({ saxEditOutline, saxTrashOutline })],
})
export class TimelineEventMenuComponent {
  timelineEvent = input.required<EditableViewTimelineEvent>();
}
