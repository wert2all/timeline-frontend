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
  saxInformationOutline,
  saxMoreSquareOutline,
} from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
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
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { EventContentImage } from '../../../../shared/ui/event/content/content.types';
import { ListComponent } from '../../components/list/list.component';
import { ListEventsActions } from '../../store/timeline.actions';
import { timelineFeature } from '../../store/timeline.reducers';
import { ExistTimelineEvent } from '../../store/timeline.types';

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
  viewProviders: [provideIcons({ saxInformationOutline })],
})
export class SharedTimelineComponent {
  timelineId = input.required<number>();
  limit = input<number | null>(null);

  isEditable = input<boolean>(false);

  delete = output<Iterable>();
  edit = output<ExistTimelineEvent>();

  private readonly store = inject(Store);

  protected readonly moreIcon = saxMoreSquareOutline;

  private readonly images = this.store.selectSignal(
    imagesFeature.selectLoadedImages
  );
  private readonly activeAccountId = this.store.selectSignal(
    sharedFeature.selectActiveAccoundId
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
    timelineFeature.selectEvents
  );
  private readonly viewEvents = this.store.selectSignal(
    timelineFeature.selectViewEvents
  );
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

  loadMore() {
    throw new Error('Method not implemented.');
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

  editEvent(event: Iterable) {
    const editableEvent = this.rawEvents()?.find(e => e.id === event.id);
    if (editableEvent) {
      this.edit.emit(editableEvent);
    }
  }
}
