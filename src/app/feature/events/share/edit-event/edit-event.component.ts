import {
  Component,
  Signal,
  computed,
  inject,
  linkedSignal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';

import { Pending, Status } from '../../../../app.types';
import { createViewDatetime } from '../../../../libs/view/date.functions';
import { UploadActions } from '../../../../shared/store/images/images.actions';
import { imagesFeature } from '../../../../shared/store/images/images.reducer';
import { SharedEventContentComponent } from '../../../../shared/ui/event/content/content.component';
import {
  EventContent,
  EventContentIcon,
  EventContentTag,
} from '../../../../shared/ui/event/content/content.types';
import { PreviewActions } from '../../../authorized/dashboard/store/preview/preview.actions';
import { previewFeature } from '../../../authorized/dashboard/store/preview/preview.reducers';
import { IconComponent } from '../../../timeline/components/event/icon/icon.component';
import {
  TimelineEvent,
  TimelineEventType,
} from '../../../timeline/store/timeline.types';
import { EditEventFormComponent } from '../../edit-event-form/edit-event-form.component';
import { EditEventFormViewHelper } from '../../edit-event-form/edit-event-form.types';
import { EventOperationsActions } from '../../store/operations/operations.actions';
import { eventOperationsFeature } from '../../store/operations/operations.reducer';
import { EditEventFormChanges } from './edit-event.types';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [SharedEventContentComponent, IconComponent, EditEventFormComponent],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent {
  private readonly store = inject(Store);

  protected readonly editedEvent = this.store.selectSignal(
    eventOperationsFeature.selectEditedEvent
  );
  private readonly updatedEvent = linkedSignal({
    source: this.editedEvent,
    computation: event => event,
  });

  protected readonly loading = this.store.selectSignal(
    eventOperationsFeature.selectLoading
  );
  private readonly images = this.store.selectSignal(
    imagesFeature.selectLoadedImages
  );
  private readonly currentUpload = this.store.selectSignal(
    imagesFeature.selectCurrentUploadImage
  );

  protected readonly isNew = computed(() => !this.editedEvent()?.id);

  protected readonly previewEvent: Signal<EventContent | null> = computed(
    () => {
      const updatedEvent = this.updatedEvent();
      if (updatedEvent) {
        const preview = this.createViewTimelineEvent(updatedEvent);

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
      } else {
        return null;
      }
    }
  );

  private readonly urlPreviews = this.store.selectSignal(
    previewFeature.selectPreviews
  );

  protected formViewHelper = computed((): EditEventFormViewHelper => {
    const event = this.updatedEvent();

    return {
      url: this.urlPreviews().find(
        preview => event?.url && preview.url === event?.url
      ),
      image: this.currentUpload(),
    };
  });

  protected readonly icon = new EventContentIcon(TimelineEventType.default);

  protected closeEditForm() {
    this.store.dispatch(EventOperationsActions.stopEditingEvent());
  }

  protected updatePreviewEvent(value: EditEventFormChanges) {
    const time = value.time?.match('^\\d:') ? '0' + value.time : value.time;
    const date = DateTime.fromISO(value.date + (time ? 'T' + time : ''));

    this.updatedEvent.update(e =>
      e
        ? {
            ...e,
            date: (date.isValid ? date : DateTime.now()).toJSDate(),
            type: TimelineEventType.default,
            title: value.title || '',
            description: value.content || undefined,
            showTime: value.showTime || false,
            tags: value.tags || undefined,
            url: value.link || undefined,
            imageId: value.imageId || undefined,
          }
        : null
    );
  }

  protected saveEvent() {
    const event = this.updatedEvent();
    if (event) {
      this.store.dispatch(EventOperationsActions.saveEditableEvent({ event }));
    }
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
