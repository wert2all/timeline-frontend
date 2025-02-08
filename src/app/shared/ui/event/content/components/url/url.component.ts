import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLinkOutline } from '@ng-icons/iconsax/outline';
import { EventContentUrl } from '../../content.types';

@Component({
  selector: 'app-timeline-event-url',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './url.component.html',
  viewProviders: [provideIcons({ saxLinkOutline })],
})
export class UrlComponent {
  url = input.required<EventContentUrl | null>();
}
