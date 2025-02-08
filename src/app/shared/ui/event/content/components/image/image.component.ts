import { Component, computed, input } from '@angular/core';
import { Status } from '../../../../../../app.types';
import { ViewEventImage } from '../../../../../../feature/timeline/store/timeline.types';
import { SharedLoaderComponent } from '../../../../../content/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-timeline-event-image',
  templateUrl: './image.component.html',
  imports: [SharedLoaderComponent],
})
export class ImageComponent {
  image = input.required<ViewEventImage>();

  isLoading = computed(
    () => this.image().status === Status.LOADING || !this.image().previewUrl
  );
}
