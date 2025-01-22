import { Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../shared/layout/layout.component';

import { TimelineActions } from './store/timeline/timeline.actions';
import { timelineFeature } from './store/timeline/timeline.reducer';

import {
  Iterable,
  Status,
  StatusWithPending,
  Undefined,
} from '../../../app.types';
import { AddEventButtonComponent } from '../../timeline/components/add-event-button/add-event-button.component';
import { CreateTimelineButtonComponent } from '../../timeline/components/create-timeline-button/create-timeline-button.component';
import { TimelineComponent } from '../../timeline/timeline.component';
import { EditEventComponent } from './edit-event/edit-event.component';

import { imagesFeature } from '../../../shared/store/images/images.reducer';
import { accountFeature } from '../../../store/account/account.reducer';
import { ViewTimelineTag } from '../../timeline/timeline.types';
import { ModalConfirmComponent } from './confirm/modal-confirm.component';
import { ModalFactoryComponent } from './modal/modal-factory.component';
import { EventActions } from './store/events/events.actions';
import { eventsFeature } from './store/events/events.reducer';
import { LoadEventActionOptions } from './store/events/events.types';

@Component({
  standalone: true,
  templateUrl: './my-page.component.html',
  imports: [
    LayoutComponent,
    CreateTimelineButtonComponent,
    EditEventComponent,
    AddEventButtonComponent,
    ModalConfirmComponent,
    TimelineComponent,
    ModalFactoryComponent,
  ],
})
export class MyPageComponent {
  private readonly store = inject(Store);

  private readonly isEditingEvent = this.store.selectSignal(
    eventsFeature.isEditingEvent
  );
  private readonly rawTimelineEvents = this.store.selectSignal(
    eventsFeature.selectActiveTimelineViewEvents
  );
  private readonly rawImages = this.store.selectSignal(
    imagesFeature.selectLoadedImages
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
  protected readonly isEventsLoading = this.store.selectSignal(
    eventsFeature.selectLoading
  );

  protected readonly showTipForAddEvent = this.store.selectSignal(
    timelineFeature.selectNewTimelineAdded
  );
  protected readonly canAddNewEvent = computed(() => !this.isEditingEvent());
  protected readonly timeline = computed(() => {
    const images = this.rawImages();
    return this.rawTimelineEvents().map(event => {
      if (event.image) {
        const image = images.find(i => i.id === event.image?.imageId);
        if (image) {
          return {
            ...event,
            image: {
              ...event.image,
              previewUrl: image.data?.resized_490x250,
              status: this.convertImageStatus(image.status),
            },
          };
        }
      }

      return event;
    });
  });
  protected readonly activeAccountId = this.store.selectSignal(
    accountFeature.selectActiveAccountId
  );

  protected readonly shouldDeleteEventId = signal<number>(0);
  private readonly shouldDeleteImageId = computed(() => {
    return this.rawTimelineEvents().find(
      event => (event.id = this.shouldDeleteEventId())
    )?.imageId;
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
  protected readonly lastEventCursor = this.store.selectSignal(
    eventsFeature.selectNextCursor
  );
  protected readonly hasMoreEvents = this.store.selectSignal(
    eventsFeature.selectHasNextPage
  );

  protected readonly loadEventsOptions = computed(
    (): LoadEventActionOptions | null => {
      const accountId = this.activeAccountId();
      const timelineId = this.activeTimeline()?.id || null;
      const cursor = this.lastEventCursor();
      return accountId && timelineId ? { accountId, timelineId, cursor } : null;
    }
  );

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
  //     ApplicationActions.opensModalWindow({
  //       windowType: ModalWindowType.SETTINGS,
  //     })
  //   );
  // }

  filterByTag(tag: ViewTimelineTag) {
    throw new Error('Method not implemented.' + tag);
  }

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

  loadMoreEvents() {
    const loadOptions = this.loadEventsOptions();
    if (loadOptions) {
      this.store.dispatch(EventActions.loadMoreEvents(loadOptions));
    }
  }

  private convertImageStatus(status: StatusWithPending): Status {
    switch (status) {
      case Status.ERROR:
        return Status.ERROR;
      case Status.SUCCESS:
        return Status.SUCCESS;
      default:
        return Status.LOADING;
    }
  }
}
