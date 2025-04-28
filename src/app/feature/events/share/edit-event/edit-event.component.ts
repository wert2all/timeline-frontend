import {
  Component,
  Signal,
  computed,
  inject,
  linkedSignal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';

import { UploadActions } from '../../../../shared/store/images/images.actions';
import { imagesFeature } from '../../../../shared/store/images/images.reducer';
import { selectLoadedImage } from '../../../../shared/store/shared/shared.functions';
import { SharedEventContentComponent } from '../../../../shared/ui/event/content/content.component';
import { EventContentConvertor } from '../../../../shared/ui/event/content/content.convertor';
import {
  EventContent,
  EventContentIcon,
} from '../../../../shared/ui/event/content/content.types';
import { EditEventActions } from '../../../dashboard/store/operations/actions/edit-event.actions';
import { dashboardOperationsFeature } from '../../../dashboard/store/operations/operations.reducers';
import { PreviewActions } from '../../../dashboard/store/preview/preview.actions';
import { previewFeature } from '../../../dashboard/store/preview/preview.reducers';
import { IconComponent } from '../../../timeline/components/event/icon/icon.component';
import { EditEventFormComponent } from '../../edit-event-form/edit-event-form.component';
import { EditEventFormViewHelper } from '../../edit-event-form/edit-event-form.types';
import { eventsFeature } from '../../store/events.reducer';
import { EventType } from '../../store/events.types';
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
  private readonly eventConvertor = inject(EventContentConvertor);

  protected readonly editedEvent = this.store.selectSignal(
    dashboardOperationsFeature.selectEditedEvent
  );
  private readonly updatedEvent = linkedSignal({
    source: this.editedEvent,
    computation: event => event,
  });

  protected readonly loading = this.store.selectSignal(
    eventsFeature.selectLoading
  );

  private readonly previewImage = computed(() => {
    const updatedEvent = this.updatedEvent();
    return updatedEvent?.imageId
      ? selectLoadedImage(updatedEvent.imageId, this.store)
      : null;
  });

  private readonly currentUpload = this.store.selectSignal(
    imagesFeature.selectCurrentUploadImage
  );

  protected readonly isNew = computed(() => !this.editedEvent()?.id);

  protected readonly previewEvent: Signal<EventContent | null> = computed(
    () => {
      const updatedEvent = this.updatedEvent();
      return updatedEvent
        ? this.eventConvertor.fromEvent(updatedEvent, this.previewImage())
        : null;
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

  protected readonly icon = new EventContentIcon(EventType.default);

  protected closeEditForm() {
    this.store.dispatch(EditEventActions.stopEditingEvent());
  }

  protected updatePreviewEvent(value: EditEventFormChanges) {
    const time = value.time?.match('^\\d:') ? '0' + value.time : value.time;
    const date = DateTime.fromISO(value.date + (time ? 'T' + time : ''));

    this.updatedEvent.update(e =>
      e
        ? {
            ...e,
            date: (date.isValid ? date : DateTime.now()).toJSDate(),
            type: EventType.default,
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
      this.store.dispatch(EditEventActions.saveEditableEvent({ event }));
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
}
