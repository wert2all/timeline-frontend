import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Iterable } from '../../app.types';

import { provideIcons } from '@ng-icons/core';
import { saxMoreSquareOutline } from '@ng-icons/iconsax/outline';
import { LoadingButtonComponent } from '../../shared/content/loading-button/loading-button.component';
import { EventMainContentComponent } from './components/event/content/main-content.component';
import { IconComponent } from './components/event/icon/icon.component';
import { TimelineEventMenuComponent } from './components/event/menu/menu.component';
import {
  ExistViewTimelineEvent,
  ViewTimelineTag,
} from './store/timeline.types';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxMoreSquareOutline })],
  imports: [
    CommonModule,
    IconComponent,
    EventMainContentComponent,
    TimelineEventMenuComponent,
    LoadingButtonComponent,
  ],
})
export class TimelineComponent {
  timeline = input.required<ExistViewTimelineEvent[]>();
  canEdit = input(false);
  hasMore = input(false);
  isLoading = input(false);

  filterByTag = output<ViewTimelineTag>();
  delete = output<Iterable>();
  edit = output<Iterable>();
  loadMore = output();

  icon = saxMoreSquareOutline;

  canEditEvent(event: ExistViewTimelineEvent): boolean {
    return this.canEdit() && !!event.id;
  }
}
