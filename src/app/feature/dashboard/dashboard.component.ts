import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Iterable, Undefined } from '../../app.types';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { NavigationBuilder } from '../../shared/services/navigation/navigation.builder';
import { SharedActions } from '../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../shared/store/shared/shared.reducers';
import { eventsFeature } from '../events/store/events.reducer';
import { SharedTimelineComponent } from '../timeline/share/timeline/timeline.component';
import { LoadTimelinesActions } from '../timeline/store/actions/load-timelines.actions';
import { ModalWindowActions } from '../ui/layout/store/modal-window/modal-window.actions';
import { ModalWindowType } from '../ui/layout/store/modal-window/modal-window.types';
import { TopDashboardButtonComponent } from './add-event-button/top-dashboard-button.component';
import { ModalConfirmComponent } from './confirm/modal-confirm.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { DeleteEventActions } from './store/operations/actions/delete-event.actions';
import { EditEventActions } from './store/operations/actions/edit-event.actions';
import { dashboardOperationsFeature } from './store/operations/operations.reducers';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [
    LayoutComponent,
    EditEventComponent,
    TopDashboardButtonComponent,
    ModalConfirmComponent,
    SharedTimelineComponent,
  ],
})
export class DashboardPageComponent {
  action = input<string | null>(null);
  idParam = input<string | null>(null);

  private readonly store = inject(Store);
  private readonly navigationBuilder = inject(NavigationBuilder);

  protected actionId = computed(() => {
    const actionId = Number(this.idParam());
    return actionId && !isNaN(actionId) ? actionId : null;
  });

  private readonly activeTimeline = this.store.selectSignal(
    dashboardOperationsFeature.selectCurrentTimeline
  );
  protected readonly activeTimelineId = computed(
    () => this.activeTimeline()?.id
  );

  protected readonly activeAccountId = this.store.selectSignal(
    sharedFeature.selectActiveAccountId
  );

  protected readonly isLoading = computed(() => !this.activeAccountId());
  protected readonly isEventLoading = this.store.selectSignal(
    eventsFeature.selectLoading
  );

  protected readonly showTipForAddEvent = this.store.selectSignal(
    dashboardOperationsFeature.selectNewTimelineAdded
  );

  protected readonly isEditingEvent = this.store.selectSignal(
    dashboardOperationsFeature.isEditingEvent
  );

  protected readonly shouldDeleteEventId = signal<number>(0);
  private readonly shouldDeleteImageId = computed(() => {
    return this.shouldDeleteEventId();
  });
  protected readonly showConfirmWindow = computed(
    () => this.shouldDeleteEventId() > 0
  );

  protected editedEvent = this.store.selectSignal(
    dashboardOperationsFeature.selectEditedEvent
  );

  constructor() {
    effect(() => {
      const action = this.action();
      switch (action) {
        case 'add-timeline':
          this.showAddTimelineWindow();
          break;
        case 'add-event':
          this.showAddEventForm();
          break;
        case 'edit-event':
          this.editEvent(this.actionId());
          break;
      }
    });

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
      DeleteEventActions.confirmToDeleteEvent({ eventId: event.id })
    );
  }

  confirmDelete() {
    if (this.shouldDeleteEventId() > 0) {
      this.store.dispatch(
        DeleteEventActions.deleteEvent({
          eventId: this.shouldDeleteEventId(),
          imageId: this.shouldDeleteImageId(),
        })
      );
    }
    this.shouldDeleteEventId.set(0);
  }

  dismissDelete() {
    this.store.dispatch(
      DeleteEventActions.dismissDeleteEvent({
        eventId: this.shouldDeleteEventId(),
      })
    );
    this.shouldDeleteEventId.set(0);
  }

  editEvent(eventId: number | Undefined) {
    if (eventId) {
      this.store.dispatch(
        EditEventActions.dispatchEditEvent({
          eventId,
          accountId: this.activeAccountId(),
        })
      );
    }
  }

  showAddEventForm() {
    const timelineId = this.activeTimelineId();
    if (timelineId) {
      this.store.dispatch(EditEventActions.dispatchAddNewEvent({ timelineId }));
    }
  }

  showAddTimelineWindow() {
    this.store.dispatch(
      ModalWindowActions.openModalWindow({
        windowType: ModalWindowType.ADD_TIMELINE,
      })
    );
  }

  navigateToAddTimeline() {
    this.store.dispatch(
      SharedActions.navigate({
        destination: this.navigationBuilder.forDashboard().addTimeline(),
      })
    );
  }

  navigateToAddEvent() {
    this.store.dispatch(
      SharedActions.navigate({
        destination: this.navigationBuilder.forDashboard().addEvent(),
      })
    );
  }

  navigateToEditEvent(eventId: number) {
    this.store.dispatch(
      SharedActions.navigate({
        destination: this.navigationBuilder.forDashboard().editEvent(eventId),
      })
    );
  }

  closeEditForm() {
    this.store.dispatch(EditEventActions.stopEditingEvent());
  }
}
