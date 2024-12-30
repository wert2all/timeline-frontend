import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MarkdownContentComponent } from '../../../../../share/markdown-content/markdown-content.component';
import {
  TimelineEventType,
  ViewTimelineEvent,
} from '../../../../../store/timeline/timeline.types';
import { ViewTimelineTag } from '../../../timeline.types';
import { DateComponent } from '../date/date.component';
import { EventImageComponent } from '../image/image.component';
import { TagsComponent } from '../tags/tags.component';
import { UrlComponent } from '../url/url.component';

@Component({
  selector: 'app-timeline-event-main-content',
  standalone: true,
  templateUrl: './main-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UrlComponent,
    MarkdownContentComponent,
    TagsComponent,
    DateComponent,
    EventImageComponent,
  ],
})
export class EventMainContentComponent {
  TimelimeEventType = TimelineEventType;
  event = input.required<ViewTimelineEvent>();
  filterByTag = output<ViewTimelineTag>();
}
