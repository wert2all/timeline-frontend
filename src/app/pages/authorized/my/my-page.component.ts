import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../share/layout/layout.component';

import {
  EventActions,
  TimelineActions,
} from '../../../store/timeline/timeline.actions';
import { timelineFeature } from '../../../store/timeline/timeline.reducer';

import {
  Iterable,
  Status,
  StatusWithPending,
  Undefined,
} from '../../../app.types';
import { EditEventComponent } from '../../../feature/edit-event/edit-event.component';
import { AddEventButtonComponent } from '../../../feature/timeline/components/add-event-button/add-event-button.component';
import { CreateTimelineButtonComponent } from '../../../feature/timeline/components/create-timeline-button/create-timeline-button.component';
import { TimelineComponent } from '../../../feature/timeline/timeline.component';

import { ViewTimelineTag } from '../../../feature/timeline/timeline.types';
import { ModalConfirmComponent } from '../../../share/modal/confirm/modal-confirm.component';
import { accountFeature } from '../../../store/account/account.reducer';
import { imagesFeature } from '../../../store/images/images.reducer';
import { TableOfContentsActions } from '../../../store/table-of-contents/table-of-contents.actions';

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
  private readonly rawTimelineEvents = this.store.selectSignal(
    timelineFeature.selectActiveTimelineViewEvents
  );
  private readonly rawImages = this.store.selectSignal(
    imagesFeature.selectLoadedImages
  );
  protected readonly isTimelineLoading = this.store.selectSignal(
    timelineFeature.isLoading
  );

  protected readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );

  protected readonly isLoading = computed(() => {
    return !this.activeAccount() || this.isTimelineLoading();
  });

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
  protected readonly activeAccount = this.store.selectSignal(
    accountFeature.selectActiveAccount
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

  constructor() {
    this.store.dispatch(TableOfContentsActions.cleanItems());

    effect(() => {
      const account = this.activeAccount();
      if (account) {
        this.store.dispatch(
          TimelineActions.loadAccountTimelines({ accountId: account.id })
        );
      }
    });
  }

  editEvent(event: Iterable) {
    this.store.dispatch(EventActions.showEditEventForm({ eventId: event.id }));
  }

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

  dispatchNewEventCreation() {
    this.store.dispatch(
      EventActions.showAddEventForm({ timelineId: this.timelineId() })
    );
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
