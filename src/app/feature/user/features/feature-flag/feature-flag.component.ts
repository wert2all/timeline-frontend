import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
} from '@angular/core';
import {
  AccountFeaturesSettings,
  FeatureFlagName,
  FeaturesAccount,
  FeaturesService,
} from '../../../features.service';

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
