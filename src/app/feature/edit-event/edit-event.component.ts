import { Component, computed, inject, signal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { AutoAnimateDirective } from '../../libs/auto-animate.directive';
import {
  createDefaultTimelineEvent,
  createViewTimelineEvent,
} from '../../store/timeline/editable-event-view.factory';
import { EventActions } from '../../store/timeline/timeline.actions';
import { timelineFeature } from '../../store/timeline/timeline.reducer';
import {
  TimelineEvent,
  TimelineEventType,
  ViewTimelineEvent,
} from '../../store/timeline/timeline.types';

import { EventMainContentComponent } from '../timeline/components/event/content/main-content.component';
import { IconComponent } from '../timeline/components/event/icon/icon.component';
import { ViewTimelineEventIcon } from '../timeline/timeline.types';
import { EditEventFormComponent } from './edit-event-form/edit-event-form.component';
import { EditValue } from './edit-event.types';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    AutoAnimateDirective,
    EventMainContentComponent,
    IconComponent,
    EditEventFormComponent,
  ],
  templateUrl: './edit-event.component.html',
})
export class EditEventComponent {
  private readonly store = inject(Store);
  protected readonly editEvent = this.store.selectSignal(
    timelineFeature.selectEditEvent
  );
  private readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );

  private readonly timelineId = computed(() => this.activeTimeline()?.id || 0);

  protected readonly icon = new ViewTimelineEventIcon(
    TimelineEventType.default
  );
  protected readonly previewEvent: Signal<ViewTimelineEvent> = computed(() =>
    createViewTimelineEvent(
      this.editEvent()?.event || createDefaultTimelineEvent(this.timelineId()),
      false
    )
  );
  protected readonly openTab = signal(0);

  protected readonly formEvent: Signal<ViewTimelineEvent> = computed(() => ({
    ...createViewTimelineEvent(
      this.editEvent()?.event || createDefaultTimelineEvent(this.timelineId()),
      false
    ),
    isEditableType: true,
  }));
  protected loading = computed(() => this.editEvent()?.loading === true);

  protected closeEditForm() {
    this.store.dispatch(EventActions.closeEditForm());
  }

  protected updatePreviewEvent(value: EditValue) {
    const time = value.time?.match('^\\d:') ? '0' + value.time : value.time;
    const date = DateTime.fromISO(value.date + (time ? 'T' + time : ''));
    const updatedEvent: TimelineEvent = {
      id: value.id || undefined,
      date: (date.isValid ? date : DateTime.now()).toJSDate(),
      type: TimelineEventType.default,
      title: value.title || '',
      description: value.content || undefined,
      showTime: (value.withTime && value.showTime) || false,
      tags: value.tags || undefined,
      url: value.url || undefined,
      loading: false,
      timelineId: this.timelineId(),
      imageId: value.imageId || undefined,
    };
    this.store.dispatch(
      EventActions.updatePreviewOfEditableEvent({ event: updatedEvent })
    );
  }

  protected saveEvent() {
    this.store.dispatch(EventActions.saveEditableEvent());
  }
}
