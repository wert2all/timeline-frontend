import { Component, input, output } from '@angular/core';
import { CreateTimelineButtonComponent } from '../../../../share/timeline/create/create-timeline-button/create-timeline-button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CreateTimelineButtonComponent],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  isAuthorized = input.required<boolean>();
  isLoading = input.required<boolean>();

  addTimeline = output<string | null>();
  login = output();
}
