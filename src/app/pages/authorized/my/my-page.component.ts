import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../share/layout/layout.component';
import { authFeature } from '../../../store/auth/auth.reducer';
import { timelineFeature } from '../../../store/timeline/timeline.reducer';
import { TimelineComponent } from '../../../widgets/timeline-container/timeline-container.component';

@Component({
  selector: 'app-my-page',
  standalone: true,
  templateUrl: './my-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LayoutComponent, TimelineComponent],
})
export class MyPageComponent {
  private readonly store = inject(Store);
  isAuthLoading = this.store.selectSignal(authFeature.isLoading);
  isTimelineLoading = this.store.selectSignal(timelineFeature.isLoading);

  isLoading = computed(() => {
    return this.isAuthLoading() || this.isTimelineLoading();
  });
}
