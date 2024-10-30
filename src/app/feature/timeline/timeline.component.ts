import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Iterable } from '../../app.types';
import { AutoAnimateDirective } from '../../libs/auto-animate.directive';
import { ExistViewTimelineEvent } from '../../store/timeline/timeline.types';

import { MarkdownContentComponent } from '../../share/markdown-content/markdown-content.component';
import { EditEventFormComponent } from '../edit-event/edit-event-form/edit-event-form.component';
import { EventMainContentComponent } from './components/event/content/main/main-content.component';
import { DateComponent } from './components/event/date/date.component';
import { IconComponent } from './components/event/icon/icon.component';
import { TimelineEventMenuComponent } from './components/event/menu/menu.component';
import { TagsComponent } from './components/event/tags/tags.component';
import { UrlComponent } from './components/event/url/url.component';
import { ViewTimelineTag } from './timeline.types';

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
  canEdit = input(false);

  filterByTag = output<ViewTimelineTag>();
  onDelete = output<Iterable>();
  onEdit = output<Iterable>();

  canEditEvent(event: ExistViewTimelineEvent): boolean {
    return this.canEdit() && !!event.id;
  }
}
