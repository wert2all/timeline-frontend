import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxHierarchySquare3Outline } from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { ModalComponent } from '../../share/modal/modal.component';
import { authFeature } from '../../store/auth/auth.reducer';
import {
  EventActions,
  TimelineActions,
} from '../../store/timeline/timeline.actions';
import { timelineFeature } from '../../store/timeline/timeline.reducer';
import { ActiveTimelineComponent } from './active-timeline/active-timeline.component';
import { AddEventButtonComponent } from './add-event-button/add-event-button.component';
import { AddTimelineComponent } from './add-timeline/add-timeline.component';
import { EditableTimelineEvent, ViewTimelineTag } from './timeline.types';
@Component({
  selector: 'app-timeline-container',
  templateUrl: './timeline-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  viewProviders: [
    provideIcons({
      saxHierarchySquare3Outline,
    }),
  ],
  imports: [
    AsyncPipe,
    AddEventButtonComponent,
    ActiveTimelineComponent,
    ReactiveFormsModule,
    NgIconComponent,
    ModalComponent,
    AddTimelineComponent,
  ],
})
export class TimelineComponent {
  private store = inject(Store);

  private readonly previewEvent = this.store.selectSignal(
    timelineFeature.selectPreview
  );
  readonly timeline = this.store.selectSignal(
    timelineFeature.selectEditableEvents
  );
  readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );
  readonly isAuthorized = this.store.selectSignal(authFeature.isAuthorized);
  readonly isLoading = this.store.selectSignal(timelineFeature.isLoading);

  readonly showAddTimelineWindow = signal<boolean>(false);

  canAddNewEvent = computed(() => this.previewEvent() === null);

  addEvent() {
    this.store.dispatch(EventActions.createPreview());
  }

  filterByTag(tag: ViewTimelineTag) {
    throw new Error('Method not implemented.' + tag);
  }

  dismiss() {
    this.store.dispatch(EventActions.cleanPreview());
  }

  insertEvent() {
    this.store.dispatch(EventActions.addEvent());
  }

  toggleAddTimelineForm() {
    this.showAddTimelineWindow.set(true);
  }

  addTimeline(name: string | null) {
    this.store.dispatch(
      this.isAuthorized()
        ? TimelineActions.addTimeline({ name: name })
        : TimelineActions.addTimelineAfterLogin({ name: name })
    );
  }

  updatePreview(event: EditableTimelineEvent | null) {
    this.store.dispatch(EventActions.updatePreview({ event: event }));
  }
}
