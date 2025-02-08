import { Component, computed, input } from '@angular/core';
import { Status } from '../../../../../../app.types';
import { SharedLoaderComponent } from '../../../../../content/loader/loader.component';
import { EventContentImage } from '../../content.types';

@Component({
  standalone: true,
  selector: 'app-timeline-event-image',
  templateUrl: './image.component.html',
  imports: [SharedLoaderComponent],
})
export class ImageComponent {
  image = input.required<EventContentImage>();

  isLoading = computed(
    () => this.image().status === Status.LOADING || !this.image().previewUrl
  );
}
