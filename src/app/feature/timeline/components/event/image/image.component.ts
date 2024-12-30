import { Component, input } from '@angular/core';
import { ViewEventImage } from '../../../../../store/timeline/timeline.types';

@Component({
  standalone: true,
  selector: 'app-timeline-event-image',
  templateUrl: './image.component.html',
})
export class EventImageComponent {
  image = input.required<ViewEventImage>();
}
