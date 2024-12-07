import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { ModalComponent } from '../../../../share/modal/modal.component';
import { FeatureFlagName } from '../../../features.service';
import { FeatureStageComponent } from '../feature-stage/feature-stage.component';
import { UserFeature } from './show-user-features.types';
type ViewFeature = UserFeature & { key: FeatureFlagName };
@Component({
  selector: 'app-show-user-features',
  standalone: true,
  imports: [CommonModule, ModalComponent, FeatureStageComponent],
  templateUrl: './show-user-features.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowUserFeaturesComponent {
  features = input.required<ViewFeature[]>();
  showFeatures = input(false);

  save = output<{ name: FeatureFlagName; active: boolean }>();
  close = output();

  changeFeature(feature: ViewFeature, event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    this.save.emit({ name: feature.key, active: input.checked });
  }
}
