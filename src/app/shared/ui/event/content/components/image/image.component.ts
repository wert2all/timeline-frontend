import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeImageDelete02 } from '@ng-icons/huge-icons';
import { Status } from '../../../../../../app.types';
import { SharedLoaderComponent } from '../../../../../content/loader/loader.component';
import { EventContentImage } from '../../content.types';

@Component({
  standalone: true,
  selector: 'app-timeline-event-image',
  templateUrl: './image.component.html',
  imports: [SharedLoaderComponent, NgIconComponent],
  viewProviders: [provideIcons({ hugeImageDelete02 })],
})
export class ImageComponent {
  image = input.required<EventContentImage>();

  isLoading = computed(() => this.image().status === Status.LOADING);
  isError = computed(() => this.image().status === Status.ERROR);
}
