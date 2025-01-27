import {
  Component,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { timelineFeature } from '../store/timeline/timeline.reducer';
import { createDefaultTimelineEvent } from './editable-event-view.factory';

import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Pending, Status } from '../../../../app.types';
import { createViewDatetime } from '../../../../libs/view/date.functions';
import { UploadActions } from '../../../../shared/store/images/images.actions';
import { imagesFeature } from '../../../../shared/store/images/images.reducer';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { SharedEventContentComponent } from '../../../../shared/ui/event/content/content.component';
import {
  EventContent,
  EventContentIcon,
  EventContentTag,
} from '../../../../shared/ui/event/content/content.types';
import { EventOperationsActions } from '../../../events/store/operations/operations.actions';
import { eventOperationsFeature } from '../../../events/store/operations/operations.reducer';
import { IconComponent } from '../../../timeline/components/event/icon/icon.component';
import {
  TimelineEvent,
  TimelineEventType,
} from '../../../timeline/store/timeline.types';
import { PreviewActions } from '../store/preview/preview.actions';
import { previewFeature } from '../store/preview/preview.reducers';
import { EditEventFormComponent } from './edit-event-form/edit-event-form.component';
import { EditEventFormViewHelper } from './edit-event-form/edit-event-form.types';
import { EditEventFormChanges } from './edit-event.types';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [SharedEventContentComponent, IconComponent, EditEventFormComponent],
  templateUrl: './edit-event.component.html',
})
export class EditEventComponent {
  private readonly store = inject(Store);
  private readonly isEdit = this.store.selectSignal(
    eventOperationsFeature.isEditingEvent
  );
  protected readonly editEvent = this.store.selectSignal(
    eventOperationsFeature.selectShouldEditEvent
  );

  private readonly timelineId = toSignal(
    this.store
      .select(timelineFeature.selectActiveTimeline)
      //eslint-disable-next-line @ngrx/avoid-mapping-selectors
      .pipe(map(timeline => timeline?.id || 0)),
    { initialValue: 0 }
  );

  private readonly images = this.store.selectSignal(
    imagesFeature.selectLoadedImages
  );
  private readonly currentUpload = this.store.selectSignal(
    imagesFeature.selectCurrentUploadImage
  );

  protected readonly isUploadEnabled = toSignal(
    this.store
      .select(sharedFeature.selectActiveAccountFeatureSettings)
      //eslint-disable-next-line @ngrx/avoid-mapping-selectors
      .pipe(map(settings => !!settings['upload_images'])),
    { initialValue: false }
  );

  protected readonly isNew = computed(() => !this.editEvent()?.id);

  private updatedEvent = signal(createDefaultTimelineEvent(this.timelineId()));

  protected readonly previewEvent: Signal<EventContent | null> = computed(
    () => {
      const preview = this.createViewTimelineEvent(this.updatedEvent());

      if (preview && preview.image?.status === Status.LOADING) {
        const image = this.images().find(
          image =>
            image.id === preview.image?.imageId &&
            image.status !== Pending.PENDING
        );
        if (image) {
          preview.image.imageId = image.id;
          preview.image.previewUrl = image.data?.resized_490x250;
          preview.image.status =
            image.status === Status.SUCCESS ? Status.SUCCESS : Status.ERROR;
        }
      }

      return preview;
    }
  );

  private readonly urlPreviews = this.store.selectSignal(
    previewFeature.selectPreviews
  );

  protected formViewHelper = computed((): EditEventFormViewHelper => {
    const event = this.updatedEvent();
    return {
      url: this.urlPreviews().find(preview => preview.url === event.url),
      image: this.currentUpload(),
    };
  });

  protected readonly loading = signal(false);

  protected readonly icon = new EventContentIcon(TimelineEventType.default);

  constructor() {
    effect(() => {
      if (this.isEdit() === false) {
        this.loading.set(false);
      }
    });
  }

  protected closeEditForm() {
    this.store.dispatch(EventOperationsActions.stopEditingEvent());
  }

  protected updatePreviewEvent(value: EditEventFormChanges) {
    const time = value.time?.match('^\\d:') ? '0' + value.time : value.time;
    const date = DateTime.fromISO(value.date + (time ? 'T' + time : ''));

    this.updatedEvent.set({
      id: value.id || undefined,
      date: (date.isValid ? date : DateTime.now()).toJSDate(),
      type: TimelineEventType.default,
      title: value.title || '',
      description: value.content || undefined,
      showTime: value.showTime || false,
      tags: value.tags || undefined,
      url: value.link || undefined,
      loading: false,
      timelineId: this.timelineId(),
      imageId: value.imageId || undefined,
    });
    // if (value.shouldRemoveImages && value.shouldRemoveImages.length > 0) {
    //   this.store.dispatch(
    //     ImagesActions.maybeShouldRemoveImages({
    //       images: value.shouldRemoveImages,
    //     })
    //   );
    // }
  }

  protected saveEvent() {
    this.loading.set(true);
    this.store.dispatch(
      EventOperationsActions.saveEditableEvent({ event: this.updatedEvent() })
    );
  }

  protected dispatchUpdateUrlPreview(url: URL) {
    this.store.dispatch(PreviewActions.addURL({ url }));
  }

  protected handleFileSelected(image: File) {
    this.store.dispatch(
      UploadActions.uploadImage({
        image: image,
        uuid: URL.createObjectURL(image),
      })
    );
  }

  private createViewTimelineEvent(event: TimelineEvent): EventContent {
    return {
      ...event,
      description: event.description || '',
      icon: new EventContentIcon(event.type),
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
    return tags?.map(tag => new EventContentTag(tag)) || [];
  }
}
