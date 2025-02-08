import { Component, input, output } from '@angular/core';
import { Iterable } from '../../../../app.types';
import { ExistViewTimelineEvent } from '../../store/timeline.types';
import { EventMainContentComponent } from '../event/content/main-content.component';
import { IconComponent } from '../event/icon/icon.component';
import { TimelineEventMenuComponent } from '../event/menu/menu.component';

@Component({
  standalone: true,
  selector: 'app-timeline-events-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [
    IconComponent,
    EventMainContentComponent,
    TimelineEventMenuComponent,
  ],
})
export class ListComponent {
  events = input.required<ExistViewTimelineEvent[]>();
  canEditEvent = input<boolean>(false);

  delete = output<Iterable>();
  edit = output<Iterable>();
}
