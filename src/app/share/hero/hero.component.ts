import { Component } from '@angular/core';
import { CreateTimelineButtonComponent } from '../timeline/create/create-timeline-button/create-timeline-button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CreateTimelineButtonComponent],
  templateUrl: './hero.component.html',
})
export class HeroComponent { }
