import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../share/layout/layout.component';

import { authFeature } from '../../../store/auth/auth.reducer';
import {
  EventActions,
  TimelineActions,
} from '../../../store/timeline/timeline.actions';
import { timelineFeature } from '../../../store/timeline/timeline.reducer';

import { EditEventComponent } from '../../../feature/edit-event/edit-event.component';
import { AddEventButtonComponent } from '../../../feature/timeline/components/add-event-button/add-event-button.component';
import { CreateTimelineButtonComponent } from '../../../feature/timeline/components/create-timeline-button/create-timeline-button.component';
import { TimelineContainerComponent } from '../../../feature/timeline/timeline-container.component';

@Component({
  selector: 'app-my-page',
  standalone: true,
  templateUrl: './my-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LayoutComponent,
    CreateTimelineButtonComponent,
    TimelineContainerComponent,
    EditEventComponent,
    AddEventButtonComponent,
  ],
})
export class MyPageComponent {
  private readonly store = inject(Store);

  private readonly isEditingEvent = this.store.selectSignal(
    timelineFeature.isEditingEvent
  );
  private readonly timelineId = computed(() => this.activeTimeline()?.id || 0);

  readonly isAuthLoading = this.store.selectSignal(authFeature.isLoading);
  readonly isTimelineLoading = this.store.selectSignal(
    timelineFeature.isLoading
  );

  readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );
  readonly showTipForAddEvent = this.store.selectSignal(
    timelineFeature.selectNewTimelineAdded
  );
  readonly canAddNewEvent = computed(() => !this.isEditingEvent());

  isLoading = computed(() => {
    return this.isAuthLoading() || this.isTimelineLoading();
  });

  addTimeline(name: string | null) {
    this.store.dispatch(TimelineActions.addTimeline({ name: name }));
  }
  dispatchNewEventCreation() {
    this.store.dispatch(
      EventActions.showAddEventForm({ timelineId: this.timelineId() })
    );
  }
}
