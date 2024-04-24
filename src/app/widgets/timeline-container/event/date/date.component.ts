import { Component, input, signal } from '@angular/core';
import { ViewTimelineDate } from '../../timeline.types';
@Component({
  selector: 'app-timeline-event-date',
  templateUrl: './date.component.html',
  standalone: true,
})
export class DateComponent {
  date = input.required<ViewTimelineDate>();
  showRelevant = signal(true);

  toggle() {
    this.showRelevant.update(show => !show);
  }
}
