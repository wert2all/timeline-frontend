import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { EventContentTag } from '../../content.types';

@Component({
  standalone: true,
  selector: 'app-timeline-event-tags',
  templateUrl: './tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent {
  tags = input.required<EventContentTag[]>();
  clickToTag = output<EventContentTag>();
}
