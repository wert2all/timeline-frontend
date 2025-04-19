import { Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../shared/layout/layout.component';

import { timelineFeature } from './store/timeline/timeline.reducer';

import { Iterable, Undefined } from '../../../app.types';
import { EditEventComponent } from '../../events/share/edit-event/edit-event.component';
import { AddEventButtonComponent } from '../../timeline/components/add-event-button/add-event-button.component';
import { CreateTimelineButtonComponent } from '../../timeline/components/create-timeline-button/create-timeline-button.component';

import { sharedFeature } from '../../../shared/store/shared/shared.reducers';
import { EventOperationsActions } from '../../events/store/actions/operations.actions';
import { eventsFeature } from '../../events/store/events.reducer';
import { SharedTimelineComponent } from '../../timeline/share/timeline/timeline.component';
import { AddTimelineActions } from '../../timeline/store/actions/add-timeline.actions';
import { LoadTimelinesActions } from '../../timeline/store/actions/load-timelines.actions';
import { ExistTimelineEvent } from '../../timeline/store/timeline.types';
import { ModalConfirmComponent } from './confirm/modal-confirm.component';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
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
  protected readonly activeTimelineId = this.store.selectSignal(
    timelineFeature.selectActiveTimelineId
  );
  protected readonly activeAccountId = this.store.selectSignal(
    sharedFeature.selectActiveAccountId
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
          LoadTimelinesActions.loadAccountTimelines({ accountId })
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
      EventOperationsActions.confirmToDeleteEvent({ eventId: event.id })
    );
  }

  confirmDelete() {
    if (this.shouldDeleteEventId() > 0) {
      this.store.dispatch(
        EventOperationsActions.deleteEvent({
          eventId: this.shouldDeleteEventId(),
          imageId: this.shouldDeleteImageId(),
        })
      );
    }
    this.shouldDeleteEventId.set(0);
  }

  dismissDelete() {
    this.store.dispatch(
      EventOperationsActions.dismissDeleteEvent({
        eventId: this.shouldDeleteEventId(),
      })
    );
    this.shouldDeleteEventId.set(0);
  }

  addTimeline(name: string | Undefined, accountId: number) {
    this.store.dispatch(AddTimelineActions.addTimeline({ name, accountId }));
  }

  editEvent(event: ExistTimelineEvent) {
    this.store.dispatch(
      EventOperationsActions.dispatchEditEvent({ event: event })
    );
  }

  dispatchNewEventCreation() {
    const timelineId = this.activeTimelineId();
    if (timelineId) {
      this.store.dispatch(
        EventOperationsActions.dispatchAddNewEvent({ timelineId })
      );
    }
  }
}
