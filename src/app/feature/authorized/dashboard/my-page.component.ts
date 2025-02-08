import { Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../shared/layout/layout.component';

import { TimelineActions } from './store/timeline/timeline.actions';
import { timelineFeature } from './store/timeline/timeline.reducer';

import { Iterable, Undefined } from '../../../app.types';
import { AddEventButtonComponent } from '../../timeline/components/add-event-button/add-event-button.component';
import { CreateTimelineButtonComponent } from '../../timeline/components/create-timeline-button/create-timeline-button.component';
import { EditEventComponent } from './edit-event/edit-event.component';

import { sharedFeature } from '../../../shared/store/shared/shared.reducers';
import { EventActions } from '../../events/store/events/events.actions';
import { eventsFeature } from '../../events/store/events/events.reducer';
import { SharedTimelineComponent } from '../../timeline/share/timeline/timeline.component';
import { ModalConfirmComponent } from './confirm/modal-confirm.component';

@Component({
  standalone: true,
  templateUrl: './my-page.component.html',
  imports: [
    LayoutComponent,
    CreateTimelineButtonComponent,
    EditEventComponent,
    AddEventButtonComponent,
    ModalConfirmComponent,
    SharedTimelineComponent,
  ],
})
export class MyPageComponent {
  private readonly store = inject(Store);

  private readonly isEditingEvent = this.store.selectSignal(
    eventsFeature.isEditingEvent
  );
  protected readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );

  protected readonly isTimelineLoading = this.store.selectSignal(
    timelineFeature.isLoading
  );
  protected readonly isLoading = computed(() => {
    return !this.activeAccountId() || this.isTimelineLoading();
  });

  protected readonly showTipForAddEvent = this.store.selectSignal(
    timelineFeature.selectNewTimelineAdded
  );
  protected readonly canAddNewEvent = computed(() => !this.isEditingEvent());
  private readonly activeAccount = this.store.selectSignal(
    sharedFeature.selectActiveAccount
  );
  protected readonly activeAccountId = computed(
    () => this.activeAccount()?.id || 0
  );

  protected readonly shouldDeleteEventId = signal<number>(0);
  private readonly shouldDeleteImageId = computed(() => {
    return this.shouldDeleteEventId();
  });
  protected readonly showConfirmWindow = computed(
    () => this.shouldDeleteEventId() > 0
  );

  protected listTimelines = this.store.selectSignal(
    timelineFeature.selectTimelines
  );

  protected shouldAddTimeline = computed(() => {
    return this.listTimelines().length === 0;
  });

  constructor() {
    effect(() => {
      const accountId = this.activeAccountId();
      if (accountId) {
        this.store.dispatch(
          TimelineActions.loadAccountTimelines({ accountId })
        );
      }
    });
  }

  // ngAfterViewInit(): void {
  //   this.store.dispatch(
  //     ModalWindowActions.opensModalWindow({
  //       windowType: ModalWindowType.SETTINGS,
  //     })
  //   );
  // }

  deleteEvent(event: Iterable) {
    this.shouldDeleteEventId.set(event.id);
    this.store.dispatch(
      EventActions.confirmToDeleteEvent({ eventId: event.id })
    );
  }

  confirmDelete() {
    if (this.shouldDeleteEventId() > 0) {
      this.store.dispatch(
        EventActions.deleteEvent({
          eventId: this.shouldDeleteEventId(),
          imageId: this.shouldDeleteImageId(),
        })
      );
    }
    this.shouldDeleteEventId.set(0);
  }

  dismissDelete() {
    this.shouldDeleteEventId.set(0);
  }

  addTimeline(name: string | Undefined, accountId: number) {
    this.store.dispatch(TimelineActions.addTimeline({ name, accountId }));
  }

  editEvent(event: Iterable) {
    this.store.dispatch(EventActions.dispatchEditEvent({ eventId: event.id }));
  }

  dispatchNewEventCreation() {
    this.store.dispatch(EventActions.dispatchEditEvent({ eventId: 0 }));
  }
}
