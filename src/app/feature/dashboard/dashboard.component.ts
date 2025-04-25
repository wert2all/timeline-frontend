import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../shared/layout/layout.component';

import { Iterable } from '../../app.types';
import { EditEventComponent } from '../events/share/edit-event/edit-event.component';
import { AddEventButtonComponent } from '../timeline/components/add-event-button/add-event-button.component';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorTreeView } from '@ng-icons/phosphor-icons/regular';
import { NavigationBuilder } from '../../shared/services/navigation/navigation.builder';
import { SharedActions } from '../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../shared/store/shared/shared.reducers';
import { DeleteEventActions } from '../events/store/actions/delete-event.actions';
import { EventOperationsActions } from '../events/store/actions/operations.actions';
import { eventsFeature } from '../events/store/events.reducer';
import { SharedTimelineComponent } from '../timeline/share/timeline/timeline.component';
import { LoadTimelinesActions } from '../timeline/store/actions/load-timelines.actions';
import { timelineFeature } from '../timeline/store/timeline.reducers';
import { ExistTimelineEvent } from '../timeline/store/timeline.types';
import { ModalWindowActions } from '../ui/layout/store/modal-window/modal-window.actions';
import { ModalWindowType } from '../ui/layout/store/modal-window/modal-window.types';
import { ModalConfirmComponent } from './confirm/modal-confirm.component';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
  viewProviders: [provideIcons({ phosphorTreeView })],
  imports: [
    LayoutComponent,
    EditEventComponent,
    AddEventButtonComponent,
    ModalConfirmComponent,
    SharedTimelineComponent,
    NgIconComponent,
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

  private readonly isEditingEvent = this.store.selectSignal(
    eventsFeature.isEditingEvent
  );
  private readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );
  protected readonly activeTimelineId = computed(
    () => this.activeTimeline()?.id
  );

  protected readonly activeAccountId = this.store.selectSignal(
    sharedFeature.selectActiveAccountId
  );

  protected readonly isLoading = computed(() => !this.activeAccountId());

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

  private listTimelines = this.store.selectSignal(
    timelineFeature.selectActiveAcccountTimelines
  );

  protected shouldAddTimeline = computed(() => {
    return this.listTimelines().length === 0;
  });

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

  editEvent(event: ExistTimelineEvent) {
    this.store.dispatch(
      EventOperationsActions.dispatchEditEvent({ event: event })
    );
  }

  showAddEventForm() {
    const timelineId = this.activeTimelineId();
    if (timelineId) {
      this.store.dispatch(
        EventOperationsActions.dispatchAddNewEvent({ timelineId })
      );
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
}
