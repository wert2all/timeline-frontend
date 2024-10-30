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
import { EventActions } from '../../store/timeline/timeline.actions';
import { timelineFeature } from '../../store/timeline/timeline.reducer';
import { TimelineComponent } from './components/timeline/timeline.component';

import { ViewTimelineTag } from './timeline.types';

@Component({
  selector: 'app-timeline-container',
  templateUrl: './timeline-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    TimelineComponent,
    ReactiveFormsModule,
    ModalComponent,
    ModalConfirmComponent,
  ],
})
export class TimelineContainerComponent {
  private store = inject(Store);

  protected readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );

  readonly timeline = this.store.selectSignal(timelineFeature.selectViewEvents);

  readonly shouldDeleteEvent = signal<number>(0);

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
}
