import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../share/layout/layout.component';
import { CreateTimelineButtonComponent } from '../../../share/timeline/create/create-timeline-button/create-timeline-button.component';
import { authFeature } from '../../../store/auth/auth.reducer';
import { TimelineActions } from '../../../store/timeline/timeline.actions';
import { timelineFeature } from '../../../store/timeline/timeline.reducer';
import { TimelineContainerComponent } from '../../../widgets/timeline-container/timeline-container.component';

@Component({
  selector: 'app-my-page',
  standalone: true,
  templateUrl: './my-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LayoutComponent,
    CreateTimelineButtonComponent,
    TimelineContainerComponent,
  ],
})
export class MyPageComponent {
  private readonly store = inject(Store);

  readonly isAuthLoading = this.store.selectSignal(authFeature.isLoading);
  readonly isTimelineLoading = this.store.selectSignal(
    timelineFeature.isLoading
  );

  readonly activeTimeline = this.store.selectSignal(
    timelineFeature.selectActiveTimeline
  );

  isLoading = computed(() => {
    return this.isAuthLoading() || this.isTimelineLoading();
  });
  addTimeline(name: string | null) {
    this.store.dispatch(TimelineActions.addTimeline({ name: name }));
  }
}
