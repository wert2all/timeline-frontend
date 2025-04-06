import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorLinkSimpleHorizontal } from '@ng-icons/phosphor-icons/regular';
import { EventContentUrl } from '../../content.types';

@Component({
  selector: 'app-timeline-event-url',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './url.component.html',
  viewProviders: [provideIcons({ phosphorLinkSimpleHorizontal })],
})
export class UrlComponent {
  url = input.required<EventContentUrl | null>();
}
