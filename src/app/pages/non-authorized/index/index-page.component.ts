import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxHierarchySquare3Outline,
  saxLogin1Outline,
} from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';

import { LayoutComponent } from '../../../share/layout/layout.component';
import { ModalComponent } from '../../../share/modal/modal.component';
import { AuthActions } from '../../../store/auth/auth.actions';
import { authFeature } from '../../../store/auth/auth.reducer';
import { TimelineActions } from '../../../store/timeline/timeline.actions';
import { timelineFeature } from '../../../store/timeline/timeline.reducer';
import { AddTimelineComponent } from '../../../widgets/timeline-container/add-timeline/add-timeline.component';

@Component({
  selector: 'app-index-page',
  standalone: true,
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ saxHierarchySquare3Outline, saxLogin1Outline }),
  ],
  imports: [
    CommonModule,
    LayoutComponent,
    NgIconComponent,
    ModalComponent,
    AddTimelineComponent,
  ],
})
export class IndexPageComponent {
  private store = inject(Store);

  private readonly isTimelineLoading = this.store.selectSignal(
    timelineFeature.isLoading
  );
  private readonly isAuthLoading = this.store.selectSignal(
    authFeature.isLoading
  );

  readonly showAddTimelineWindow = signal<boolean>(false);
  readonly isAuthorized = this.store.selectSignal(authFeature.isAuthorized);

  isLoading = computed(() => this.isTimelineLoading() || this.isAuthLoading());

  toggleAddTimelineForm() {
    this.showAddTimelineWindow.set(true);
  }

  login() {
    this.store.dispatch(AuthActions.promptLogin());
  }

  addTimeline(name: string | null) {
    this.store.dispatch(
      this.isAuthorized()
        ? TimelineActions.addTimeline({ name: name })
        : TimelineActions.addTimelineAfterLogin({ name: name })
    );
  }
}
