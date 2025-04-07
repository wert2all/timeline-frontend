import { Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FeatureFlagName,
  FeaturesService,
} from '../../../shared/services/features.service';
import { sharedFeature } from '../../../shared/store/shared/shared.reducers';

@Component({
  selector: 'app-feature-flag',
  standalone: true,
  templateUrl: './feature-flag.component.html',
})
export class FeatureFlagComponent {
  feature = input.required<FeatureFlagName>();
  nigate = input(false);

  private readonly featuresService = inject(FeaturesService);
  private readonly store = inject(Store);

  private readonly activeAccountSettings = this.store.selectSignal(
    sharedFeature.selectActiveAccountFeatureSettings
  );

  protected enabledFeature = computed(() => {
    const canShow = this.featuresService.canShow(this.feature(), {
      settings: this.activeAccountSettings(),
    });
    return this.nigate() ? !canShow : canShow;
  });
}
