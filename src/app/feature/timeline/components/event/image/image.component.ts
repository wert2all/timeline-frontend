import { Component, computed, input } from '@angular/core';
import { Status } from '../../../../../app.types';
import { LoaderComponent } from '../../../../../share/loader/loader.component';
import { ViewEventImage } from '../../../../../store/timeline/timeline.types';

@Component({
  standalone: true,
  selector: 'app-timeline-event-image',
  templateUrl: './image.component.html',
  imports: [LoaderComponent],
})
export class EventImageComponent {
  image = input.required<ViewEventImage>();

  isLoading = computed(
    () => this.image().status === Status.LOADING || !this.image().previewUrl
  );
}
