import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TimelimeEventType } from '../../../../../../store/timeline/timeline.types';
import {
  EditableViewTimelineEvent,
  ViewTimelineTag,
} from '../../../../../../widgets/timeline-container/timeline.types';
import { MarkdownContentComponent } from '../../../../../markdown-content/markdown-content.component';
import { DateComponent } from '../../date/date.component';
import { TagsComponent } from '../../tags/tags.component';
import { UrlComponent } from '../../url/url.component';
import { YoutubePreviewComponent } from '../../youtube/youtube-preview.components';
type EventView = EditableViewTimelineEvent & {
  eventLength: string;
  shouldAccentLine: boolean;
};

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
    YoutubePreviewComponent,
  ],
})
export class EventMainContentComponent {
  TimelimeEventType = TimelimeEventType;
  event = input.required<EventView>();
  filterByTag = output<ViewTimelineTag>();
}
