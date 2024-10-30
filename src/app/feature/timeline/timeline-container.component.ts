import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Iterable } from '../../app.types';
import { ModalConfirmComponent } from '../../share/modal/confirm/modal-confirm.component';
import { ModalComponent } from '../../share/modal/modal.component';
import { TimelineComponent } from '../../share/timeline/timeline/timeline.component';
import { EventActions } from '../../store/timeline/timeline.actions';
import { timelineFeature } from '../../store/timeline/timeline.reducer';

import { EditEventComponent } from '../edit-event/edit-event.component';
import { AddEventButtonComponent } from './add-event-button/add-event-button.component';
import { AddTimelineComponent } from './add-timeline/add-timeline.component';
import { ViewTimelineTag } from './timeline.types';

@Component({
  selector: 'app-timeline-container',
  templateUrl: './timeline-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    AddEventButtonComponent,
    TimelineComponent,
    ReactiveFormsModule,
    AddTimelineComponent,
    ModalComponent,
    ModalConfirmComponent,
    EditEventComponent,
  ],
})
export class TimelineContainerComponent {
  private store = inject(Store);

  private readonly isEditingEvent = this.store.selectSignal(
    timelineFeature.isEditingEvent
  );

  protected readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );
  private readonly timelineId = computed(() => this.activeTimeline()?.id || 0);
  readonly timeline = this.store.selectSignal(timelineFeature.selectViewEvents);

  readonly showTipForAddEvent = this.store.selectSignal(
    timelineFeature.selectNewTimelineAdded
  );

  readonly shouldDeleteEvent = signal<number>(0);

  canAddNewEvent = computed(() => !this.isEditingEvent());
  showConfirmWindow = computed(() => this.shouldDeleteEvent() > 0);

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

  dispatchNewEventCreation() {
    this.store.dispatch(
      EventActions.showAddEventForm({ timelineId: this.timelineId() })
    );
  }
}
