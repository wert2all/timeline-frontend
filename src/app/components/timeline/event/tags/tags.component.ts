import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ViewTimelineTag } from '../../timeline.types';

@Component({
  standalone: true,
  selector: 'app-timeline-event-tags',
  templateUrl: './tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent {
  tags = input.required<ViewTimelineTag[]>();
  clickToTag = output<ViewTimelineTag>();
}
