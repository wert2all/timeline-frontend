import { Component, input, signal } from '@angular/core';
import { ViewDatetime } from '../../../../../libs/view/date.types';

@Component({
  standalone: true,
  selector: 'app-timeline-event-date',
  templateUrl: './date.component.html',
})
export class DateComponent {
  date = input.required<ViewDatetime>();
  showRelevant = signal(true);

  toggle() {
    this.showRelevant.update(show => !show);
  }
}
