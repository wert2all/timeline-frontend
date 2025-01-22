import { Component, Signal, computed, inject, input } from '@angular/core';
import {
  AccountFeaturesSettings,
  FeatureFlagName,
  FeaturesAccount,
  FeaturesService,
} from '../../../shared/services/features.service';

@Component({
  selector: 'app-feature-flag',
  standalone: true,
  templateUrl: './feature-flag.component.html',
})
export class FeatureFlagComponent {
  private readonly featuresService = inject(FeaturesService);

  feature = input.required<FeatureFlagName>();
  accountSettings = input.required<AccountFeaturesSettings>();
  nigate = input(false);

  private account: Signal<FeaturesAccount> = computed(() => ({
    settings: this.accountSettings(),
  }));

  enabledFeature = computed(() =>
    this.nigate()
      ? !this.featuresService.canShow(this.feature(), this.account())
      : this.featuresService.canShow(this.feature(), this.account())
  );
}
