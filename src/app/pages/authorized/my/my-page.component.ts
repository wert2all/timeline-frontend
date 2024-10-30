import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../share/layout/layout.component';

import { authFeature } from '../../../store/auth/auth.reducer';
import {
  EventActions,
  TimelineActions,
} from '../../../store/timeline/timeline.actions';
import { timelineFeature } from '../../../store/timeline/timeline.reducer';

import { Iterable } from '../../../app.types';
import { EditEventComponent } from '../../../feature/edit-event/edit-event.component';
import { AddEventButtonComponent } from '../../../feature/timeline/components/add-event-button/add-event-button.component';
import { CreateTimelineButtonComponent } from '../../../feature/timeline/components/create-timeline-button/create-timeline-button.component';
import { TimelineComponent } from '../../../feature/timeline/timeline.component';

import { ViewTimelineTag } from '../../../feature/timeline/timeline.types';
import { ModalConfirmComponent } from '../../../share/modal/confirm/modal-confirm.component';

@Component({
  selector: 'app-my-page',
  standalone: true,
  templateUrl: './my-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LayoutComponent,
    CreateTimelineButtonComponent,
    EditEventComponent,
    AddEventButtonComponent,
    ModalConfirmComponent,
    TimelineComponent,
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
  readonly timeline = this.store.selectSignal(timelineFeature.selectViewEvents);

  readonly shouldDeleteEvent = signal<number>(0);

  protected readonly showConfirmWindow = computed(
    () => this.shouldDeleteEvent() > 0
  );

  editEvent(event: Iterable) {
    this.store.dispatch(EventActions.showEditEventForm({ eventId: event.id }));
  }

  filterByTag(tag: ViewTimelineTag) {
    throw new Error('Method not implemented.' + tag);
  }

  deleteEvent(event: Iterable) {
    this.shouldDeleteEvent.set(event.id);
    this.store.dispatch(
      EventActions.confirmToDeleteEvent({ eventId: event.id })
    );
  }

  confirmDelete() {
    if (this.shouldDeleteEvent() > 0) {
      this.store.dispatch(
        EventActions.deleteEvent({ eventId: this.shouldDeleteEvent() })
      );
    }
    this.shouldDeleteEvent.set(0);
  }

  dismissDelete() {
    this.shouldDeleteEvent.set(0);
  }

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
