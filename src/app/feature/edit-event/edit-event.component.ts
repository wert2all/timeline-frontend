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
import { timelineFeature } from '../../store/timeline/timeline.reducer';
import { ViewTimelineEvent } from '../../store/timeline/timeline.types';
import {
  createDefaultTimelineEvent,
  createViewTimelineEvent,
} from './editable-event-view.factory';

import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Pending, Status } from '../../app.types';
import { Tabs } from '../../share/tabs/tabs.types';
import { accountFeature } from '../../store/account/account.reducer';
import { EventActions } from '../../store/events/events.actions';
import { eventsFeature } from '../../store/events/events.reducer';
import { TimelineEventType } from '../../store/events/events.types';
import { UploadActions } from '../../store/images/images.actions';
import { imagesFeature } from '../../store/images/images.reducer';
import { PreviewActions } from '../../store/preview/preview.actions';
import { previewFeature } from '../../store/preview/preview.reducers';
import { EventMainContentComponent } from '../timeline/components/event/content/main-content.component';
import { IconComponent } from '../timeline/components/event/icon/icon.component';
import { ViewTimelineEventIcon } from '../timeline/timeline.types';
import { EditEventFormComponent } from './edit-event-form/edit-event-form.component';
import { EditEventFormViewHelper } from './edit-event-form/edit-event-form.types';
import { EditEventFormChanges } from './edit-event.types';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [EventMainContentComponent, IconComponent, EditEventFormComponent],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent {
  private readonly store = inject(Store);
  private readonly isEdit = this.store.selectSignal(
    eventsFeature.isEditingEvent
  );
  protected readonly editEvent = this.store.selectSignal(
    eventsFeature.selectShouldEditEvent
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
      .select(accountFeature.selectActiveAccountFeaturesSettings)
      //eslint-disable-next-line @ngrx/avoid-mapping-selectors
      .pipe(map(settings => !!settings['upload_images'])),
    { initialValue: false }
  );

  protected readonly isNew = computed(() => !this.editEvent()?.id);

  private updatedEvent = signal(createDefaultTimelineEvent(this.timelineId()));

  protected readonly previewEvent: Signal<ViewTimelineEvent | null> = computed(
    () => {
      const preview = createViewTimelineEvent(this.updatedEvent());

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
  protected readonly openTab = signal<Tabs | null>(null);
  protected readonly loading = signal(false);

  protected readonly icon = new ViewTimelineEventIcon(
    TimelineEventType.default
  );

  constructor() {
    effect(() => {
      if (this.isEdit() === false) {
        this.loading.set(false);
      }
    });
  }
  protected closeEditForm() {
    this.store.dispatch(EventActions.stopEditingEvent());
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
      EventActions.saveEditableEvent({ event: this.updatedEvent() })
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
}
