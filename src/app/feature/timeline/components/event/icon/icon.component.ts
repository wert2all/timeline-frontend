import { Component, input } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { EventContentIcon } from '../../../../../shared/ui/event/content/content.types';

@Component({
  selector: 'app-timeline-event-icon',
  standalone: true,
  imports: [NgIconComponent],
  template: `@if (icon()?.icon; as icon) {
    <ng-icon [svg]="icon" size="24" [class.text-accent]="shouldAccentLine()" />
  }`,
})
export class IconComponent {
  icon = input<EventContentIcon>();
  shouldAccentLine = input<boolean>();
}
