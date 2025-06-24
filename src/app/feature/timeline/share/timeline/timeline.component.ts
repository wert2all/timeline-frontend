import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  phosphorDotsThree,
  phosphorInfo,
} from '@ng-icons/phosphor-icons/regular';
import { createSelector, Store } from '@ngrx/store';
import {
  Iterable,
  Status,
  StatusWithPending,
  Undefined,
} from '../../../../app.types';
import { SharedLoaderComponent } from '../../../../shared/content/loader/loader.component';
import { LoadingButtonComponent } from '../../../../shared/content/loading-button/loading-button.component';
import { imagesFeature } from '../../../../shared/store/images/images.reducer';
import { UploadedImage } from '../../../../shared/store/images/images.types';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { EventContentImage } from '../../../../shared/ui/event/content/content.types';
import { EventUrlProvider } from '../../../events/share/event-url.provider';
import { eventsFeature } from '../../../events/store/events.reducer';
import { ExistTimelineEvent } from '../../../events/store/events.types';
import { ListComponent } from '../../components/list/list.component';
import { ListEventsActions } from '../../store/actions/list-timeline-events.actions';
import { timelineFeature } from '../../store/timeline.reducers';

@Component({
  standalone: true,
  selector: 'app-shared-timeline',
  templateUrl: './timeline.component.html',
  imports: [
    SharedLoaderComponent,
    NgIconComponent,
    ListComponent,
    LoadingButtonComponent,
  ],
  viewProviders: [provideIcons({ phosphorInfo })],
})
export class SharedTimelineComponent {
  timelineId = input.required<number>();
  limit = input<number | null>(null);

  isEditable = input<boolean>(false);
  isAuthorized = input<boolean>(false);

  edit = output<ExistTimelineEvent>();
  delete = output<Iterable>();

  private readonly store = inject(Store);
  private readonly clipboard = inject(Clipboard);
  private readonly eventUrlProvider = inject(EventUrlProvider);

  protected readonly moreIcon = phosphorDotsThree;

  private readonly images = this.store.selectSignal(
    imagesFeature.selectLoadedImages
  );
  private readonly activeAccountId = this.store.selectSignal(
    sharedFeature.selectActiveAccountId
  );
  private readonly cursor = this.store.selectSignal(
    timelineFeature.selectLastCursor
  );
  private readonly query = computed(() => {
    return {
      cursor: this.cursor(),
      timelineId: this.timelineId(),
      accountId: this.activeAccountId() || null,
    };
  });

  private readonly rawEvents = this.store.selectSignal(
    eventsFeature.selectEvents
  );
  private readonly filterEventsByTimelineSelector = computed(() =>
    createSelector(eventsFeature.selectViewEvents, events =>
      events.filter(event => event.timelineId == this.timelineId())
    )
  );
  private readonly viewEvents = computed(() => {
    return this.store.selectSignal(this.filterEventsByTimelineSelector())();
  });
  private readonly viewEventsWithoutImages = computed(() => {
    const events = this.viewEvents();
    return this.limit() ? events?.slice(0, this.limit() || 0) : events;
  });

  protected readonly isLoading = this.store.selectSignal(
    timelineFeature.selectLoading
  );
  protected readonly events = computed(() => {
    const images = this.images();
    return this.viewEventsWithoutImages()?.map(event => ({
      ...event,
      image: this.updateEventImage(event.image, images),
    }));
  });

  protected readonly error = this.store.selectSignal(
    timelineFeature.selectError
  );
  protected readonly hasLoadMore = this.store.selectSignal(
    timelineFeature.selectHasMore
  );

  constructor() {
    effect(() => {
      this.store.dispatch(ListEventsActions.loadTimelineEvents(this.query()));
    });
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

  private updateEventImage(
    eventImage: EventContentImage | Undefined,
    images: UploadedImage[]
  ) {
    const image = images.find(i => i.id === eventImage?.imageId);
    return image && eventImage
      ? {
          ...eventImage,
          previewUrl: image.data?.resized_490x250,
          status: this.convertImageStatus(image.status),
        }
      : eventImage;
  }

  loadMore() {
    throw new Error('Method not implemented.');
  }

  editEvent(event: Iterable) {
    const editableEvent = this.rawEvents()?.find(e => e.id === event.id);
    if (editableEvent) {
      this.edit.emit(editableEvent);
    }
  }

  linkEvent(event: Iterable) {
    const url = this.eventUrlProvider.provideAbsolute(event);
    this.clipboard.copy(url);
    this.store.dispatch(
      SharedActions.sendNotification({
        message: 'Copied event url: ' + url,
        withType: 'success',
      })
    );
  }

  likeEvent(event: Iterable) {
    throw new Error('Method not implemented: likeEvent ' + event);
  }
}
