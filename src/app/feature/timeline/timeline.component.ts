import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Iterable } from '../../app.types';
import { ExistViewTimelineEvent } from '../../store/timeline/timeline.types';

import { EventMainContentComponent } from './components/event/content/main-content.component';
import { IconComponent } from './components/event/icon/icon.component';
import { TimelineEventMenuComponent } from './components/event/menu/menu.component';
import { ViewTimelineTag } from './timeline.types';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IconComponent,
    EventMainContentComponent,
    TimelineEventMenuComponent,
  ],
})
export class TimelineComponent {
  timeline = input.required<ExistViewTimelineEvent[]>();
  canEdit = input(false);

  filterByTag = output<ViewTimelineTag>();
  delete = output<Iterable>();
  edit = output<Iterable>();

  canEditEvent(event: ExistViewTimelineEvent): boolean {
    return this.canEdit() && !!event.id;
  }
}
