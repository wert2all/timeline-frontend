import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorImageBroken } from '@ng-icons/phosphor-icons/regular';
import { Status } from '../../../../../../app.types';
import { SharedLoaderComponent } from '../../../../../content/loader/loader.component';
import { EventContentImage } from '../../content.types';

@Component({
  standalone: true,
  selector: 'app-timeline-event-image',
  templateUrl: './image.component.html',
  imports: [SharedLoaderComponent, NgIconComponent],
  viewProviders: [provideIcons({ phosphorImageBroken })],
})
export class ImageComponent {
  image = input.required<EventContentImage>();

  isLoading = computed(() => this.image().status === Status.LOADING);
  isError = computed(() => this.image().status === Status.ERROR);
}
