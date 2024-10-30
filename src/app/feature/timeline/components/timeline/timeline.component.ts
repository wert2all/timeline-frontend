import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Iterable } from '../../../../app.types';
import { AutoAnimateDirective } from '../../../../libs/auto-animate.directive';
import { ExistViewTimelineEvent } from '../../../../store/timeline/timeline.types';

import { MarkdownContentComponent } from '../../../../share/markdown-content/markdown-content.component';
import { EditEventFormComponent } from '../../../edit-event/edit-event-form/edit-event-form.component';
import { ViewTimelineTag } from '../../timeline.types';
import { EventMainContentComponent } from './event/content/main/main-content.component';
import { DateComponent } from './event/date/date.component';
import { IconComponent } from './event/icon/icon.component';
import { TimelineEventMenuComponent } from './event/menu/menu.component';
import { TagsComponent } from './event/tags/tags.component';
import { UrlComponent } from './event/url/url.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UrlComponent,
    MarkdownContentComponent,
    TagsComponent,
    DateComponent,
    TimelineEventMenuComponent,
    NgIconComponent,
    EditEventFormComponent,
    IconComponent,
    EventMainContentComponent,
    AutoAnimateDirective,
  ],
})
export class TimelineComponent {
  timeline = input.required<ExistViewTimelineEvent[]>();

  filterByTag = output<ViewTimelineTag>();
  onDelete = output<Iterable>();
  onEdit = output<Iterable>();
}
