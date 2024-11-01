import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FEATURE_FLAGS, FeatureFlagName } from './feature-flag.types';

@Component({
  selector: 'app-feature-flag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-flag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureFlagComponent {
  feature = input.required<FeatureFlagName>();
  enabledFeature = computed(() => FEATURE_FLAGS[this.feature()]);
}
