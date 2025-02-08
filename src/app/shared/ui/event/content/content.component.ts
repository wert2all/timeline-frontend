import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  ViewTimelineEvent,
  ViewTimelineTag,
} from '../../../../feature/timeline/store/timeline.types';
import { DateComponent } from './components/date/date.component';
import { ImageComponent } from './components/image/image.component';
import { MarkdownContentComponent } from './components/markdown-content/markdown-content.component';
import { TagsComponent } from './components/tags/tags.component';
import { UrlComponent } from './components/url/url.component';

@Component({
  standalone: true,
  selector: 'app-shared-timeline-event-content',
  templateUrl: './content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UrlComponent,
    MarkdownContentComponent,
    TagsComponent,
    DateComponent,
    ImageComponent,
  ],
})
export class SharedEventContentComponent {
  event = input.required<ViewTimelineEvent>();
  filterByTag = output<ViewTimelineTag>();
}
