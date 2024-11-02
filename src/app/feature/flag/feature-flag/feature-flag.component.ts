import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FeatureFlagName, FeaturesService } from '../../features.service';

@Component({
  selector: 'app-feature-flag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-flag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureFlagComponent {
  private readonly featuresService = inject(FeaturesService);

  feature = input.required<FeatureFlagName>();
  nigate = input(false);

  enabledFeature = computed(() =>
    this.nigate()
      ? !this.featuresService.canShow(this.feature())
      : this.featuresService.canShow(this.feature())
  );
}
