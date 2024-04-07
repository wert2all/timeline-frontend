import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ViewTimelineEvent, ViewTimelineTag } from './timeline.types';
import { DateComponent } from './event/date/date.component';
import { TagsComponent } from './event/tags/tags.component';
import { UrlComponent } from './event/url/url.component';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DateComponent, NgIconComponent, TagsComponent, UrlComponent],
})
export class TimelineComponent {
  timeline = input.required<ViewTimelineEvent[]>();
  filterByTag = output<ViewTimelineTag>();
}
