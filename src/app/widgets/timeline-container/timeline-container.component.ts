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
import { ModalConfirmComponent } from '../../share/modal/confirm/modal-confirm.component';
import { ModalComponent } from '../../share/modal/modal.component';
import { TimelineComponent } from '../../share/timeline/timeline/timeline.component';
import { EventActions } from '../../store/timeline/timeline.actions';
import { timelineFeature } from '../../store/timeline/timeline.reducer';
import { AddEventButtonComponent } from './add-event-button/add-event-button.component';
import { AddTimelineComponent } from './add-timeline/add-timeline.component';
import {
  EditableTimelineEvent,
  EditableViewTimelineEvent,
  ViewTimelineTag,
} from './timeline.types';

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
  ],
})
export class TimelineContainerComponent {
  private store = inject(Store);

  private readonly previewEvent = this.store.selectSignal(
    timelineFeature.selectPreview
  );

  readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );
  readonly timeline = this.store.selectSignal(
    timelineFeature.selectEditableEvents
  );
  readonly showTipForAddEvent = this.store.selectSignal(
    timelineFeature.selectNewTimelineAdded
  );

  readonly shouldDeleteEvent = signal<number>(0);

  canAddNewEvent = computed(() => this.previewEvent() === null);
  showConfirmWindow = computed(() => this.shouldDeleteEvent() > 0);

  addEvent() {
    this.store.dispatch(EventActions.createPreview());
  }

  filterByTag(tag: ViewTimelineTag) {
    throw new Error('Method not implemented.' + tag);
  }

  dismiss() {
    this.store.dispatch(EventActions.cleanPreview());
  }

  insertEvent() {
    this.store.dispatch(EventActions.addEvent());
  }

  updatePreview(event: EditableTimelineEvent | null) {
    this.store.dispatch(EventActions.updatePreview({ event: event }));
  }

  deleteEvent(event: EditableViewTimelineEvent) {
    if (event.id) {
      this.shouldDeleteEvent.set(event.id);
      this.store.dispatch(
        EventActions.confirmToDeleteEvent({ eventId: event.id })
      );
    }
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
}
