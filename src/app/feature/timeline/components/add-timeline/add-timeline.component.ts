import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  phosphorPlusSquare,
  phosphorSignIn,
} from '@ng-icons/phosphor-icons/regular';
import { Store } from '@ngrx/store';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { AddTimelineActions } from '../../store/actions/add-timeline.actions';
import { timelineFeature } from '../../store/timeline.reducers';

@Component({
  selector: 'app-add-timeline',
  standalone: true,
  imports: [CommonModule, NgIconComponent, ReactiveFormsModule],
  templateUrl: './add-timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ phosphorSignIn, phosphorPlusSquare })],
})
export class AddTimelineComponent {
  private readonly store = inject(Store);

  protected readonly form = inject(FormBuilder).group({ timelineName: [''] });

  protected isAuthorized = this.store.selectSignal(sharedFeature.isAuthorized);
  protected isLoading = this.store.selectSignal(timelineFeature.selectLoading);
  protected error = this.store.selectSignal(timelineFeature.selectError);

  addTimeline() {
    this.store.dispatch(
      AddTimelineActions.addTimeline({
        name: this.form.controls['timelineName'].value,
      })
    );
  }
}
