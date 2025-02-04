import { Component, input } from '@angular/core';
import { ExistViewTimelineEvent } from '../../timeline.types';
import { EventMainContentComponent } from '../event/content/main-content.component';
import { IconComponent } from '../event/icon/icon.component';

@Component({
  standalone: true,
  selector: 'app-timeline-events-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [IconComponent, EventMainContentComponent],
})
export class ListComponent {
  events = input.required<ExistViewTimelineEvent[]>();
}
