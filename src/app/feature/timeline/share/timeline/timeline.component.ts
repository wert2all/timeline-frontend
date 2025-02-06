import {
  Component,
  ResourceStatus,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxInformationOutline,
  saxMoreSquareOutline,
} from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import {
  ApiClient,
  TimelineEvent as GQLTimelineEvent,
  TimelineType as GQLTimelineType,
  TimelineEvents,
} from '../../../../api/internal/graphql';
import { Status, StatusWithPending, Undefined } from '../../../../app.types';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../libs/api.functions';
import { createViewDatetime } from '../../../../libs/view/date.functions';
import { SharedLoaderComponent } from '../../../../shared/content/loader/loader.component';
import { LoadingButtonComponent } from '../../../../shared/content/loading-button/loading-button.component';
import { imagesFeature } from '../../../../shared/store/images/images.reducer';
import { UploadedImage } from '../../../../shared/store/images/images.types';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { Timeline } from '../../../authorized/dashboard/store/timeline/timeline.types';
import { ListComponent } from '../../components/list/list.component';
import {
  ExistTimelineEvent,
  ExistViewTimelineEvent,
  TimelineEventType,
  ViewEventImage,
  ViewTimelineEventIcon,
  ViewTimelineTag,
} from '../../timeline.types';

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
  timeline = input.required<Timeline>();
  limit = input<number | null>(null);

  private readonly store = inject(Store);
  private readonly api = inject(ApiClient);

  protected readonly moreIcon = saxMoreSquareOutline;

  private readonly activeAccountId = this.store.selectSignal(
    sharedFeature.selectActiveAccoundId
  );
  private readonly images = this.store.selectSignal(
    imagesFeature.selectLoadedImages
  );

  private readonly cursor = signal<string | null>(null);

  private readonly query = computed(() => {
    return {
      cursor: this.cursor(),
      timelineId: this.timeline().id,
      accountId: this.activeAccountId() || null,
    };
  });

  private readonly eventsResource = rxResource({
    request: this.query,
    loader: ({ request }) =>
      this.api
        .getEvents({
          timelineId: request.timelineId,
          cursor: request.cursor,
          accountId: request.accountId,
        })
        .pipe(
          map(result =>
            apiAssertNotNull(extractApiData(result)?.events, 'Empty timeline')
          )
        ),
  });

  private readonly successResponse = computed((): TimelineEvents | null =>
    this.eventsResource.status() === ResourceStatus.Resolved
      ? this.eventsResource.value() || null
      : null
  );
  private readonly viewEventsWithoutImages = computed(() => {
    const events = this.successResponse()
      ?.events.map(event => this.fromApiToExistEvent(event, this.timeline().id))
      .map(event => this.createViewTimelineEvent(event));
    return this.limit() ? events?.slice(0, this.limit() || 0) : events;
  });
  private readonly allEventsImageIds = computed(() => {
    return this.viewEventsWithoutImages()
      ?.map(event => event.imageId)
      .filter(id => !!id)
      .map(id => id!);
  });
  private readonly pageData = computed(() => this.successResponse()?.page);

  protected readonly isLoading = computed(
    () => this.eventsResource.status() === ResourceStatus.Loading
  );
  protected readonly events = computed(() => {
    const images = this.images();
    return this.viewEventsWithoutImages()?.map(event => ({
      ...event,
      image: this.updateEventImage(event.image, images),
    }));
  });

  protected readonly error = computed(() =>
    this.eventsResource.status() === ResourceStatus.Error
      ? this.eventsResource.error() || 'Could not load timeline'
      : null
  );
  protected readonly hasLoadMore = computed(
    () => this.pageData()?.hasNextPage || false
  );

  constructor() {
    effect(() => {
      this.cursor.set(this.pageData()?.endCursor || null);
    });

    effect(() => {
      const images = this.allEventsImageIds();
      if (images) {
        this.store.dispatch(
          SharedActions.dispatchLoadingImages({ ids: images })
        );
      }
    });
  }

  loadMore() {
    throw new Error('Method not implemented.');
  }

  private fromApiToExistEvent(
    event: GQLTimelineEvent,
    timelineId: number
  ): ExistTimelineEvent {
    return {
      id: event.id,
      timelineId: timelineId,
      date: new Date(event.date),
      type: this.fromApiTypeToEventType(event.type),
      title: event.title || undefined,
      description: event.description || undefined,
      showTime: event.showTime === true,
      url: event.url || undefined,
      loading: false,
      tags: event.tags || [],
      imageId: event.previewlyImageId || undefined,
    };
  }

  private fromApiTypeToEventType(type: GQLTimelineType): TimelineEventType {
    switch (type) {
      case GQLTimelineType.default:
        return TimelineEventType.default;
      case GQLTimelineType.selebrate:
        return TimelineEventType.celebrate;
      default:
        return TimelineEventType.default;
    }
  }

  private createViewTimelineEvent(
    event: ExistTimelineEvent
  ): ExistViewTimelineEvent {
    return {
      ...event,
      description: event.description || '',
      icon: new ViewTimelineEventIcon(event.type),
      url: this.prepareUrl(event.url),
      date: createViewDatetime(event.date, event.showTime || false),
      tags: this.createTags(event.tags),
      image: event.imageId
        ? { imageId: event.imageId, status: Status.LOADING }
        : undefined,
    };
  }

  private prepareUrl(url: string | undefined) {
    try {
      return url ? { title: new URL(url).host, link: url } : null;
    } catch {
      return null;
    }
  }

  private createTags(tags: string[] | undefined) {
    return tags?.map(tag => new ViewTimelineTag(tag)) || [];
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
    eventImage: ViewEventImage | Undefined,
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
}
