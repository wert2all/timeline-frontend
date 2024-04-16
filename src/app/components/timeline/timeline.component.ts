import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { AddEventComponent } from '../add-event/add-event.component';
import { AddEventButtonComponent } from './add-event-button/add-event-button.component';
import { DateComponent } from './event/date/date.component';
import { TagsComponent } from './event/tags/tags.component';
import { UrlComponent } from './event/url/url.component';
import { ViewTimelineEvent, ViewTimelineTag } from './timeline.types';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DateComponent,
    NgIconComponent,
    TagsComponent,
    UrlComponent,
    AddEventComponent,
    AddEventButtonComponent,
  ],
})
export class TimelineComponent {
  timeline = input.required<ViewTimelineEvent[]>();
  filterByTag = output<ViewTimelineTag>();

  addEvent() {
    throw new Error('Method not implemented.');
  }
}
