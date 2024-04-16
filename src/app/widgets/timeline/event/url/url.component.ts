import { Component, input } from '@angular/core';
import { ViewTimelineUrl } from '../../timeline.types';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLinkOutline } from '@ng-icons/iconsax/outline';

@Component({
  selector: 'app-timeline-event-url',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './url.component.html',
  viewProviders: [provideIcons({ saxLinkOutline })],
})
export class UrlComponent {
  url = input.required<ViewTimelineUrl | null>();
}
