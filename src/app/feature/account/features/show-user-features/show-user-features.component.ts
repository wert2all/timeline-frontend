import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorArrowSquareOut } from '@ng-icons/phosphor-icons/regular';
import { Store } from '@ngrx/store';
import {
  FeatureFlagName,
  FeaturesService,
} from '../../../../shared/services/features.service';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { AccountActions } from '../../store/account.actions';
import { FeatureStageComponent } from '../feature-stage/feature-stage.component';
import { UserFeature } from './show-user-features.types';

type ViewFeature = UserFeature & { key: FeatureFlagName };
@Component({
  selector: 'app-show-user-features',
  standalone: true,
  imports: [CommonModule, FeatureStageComponent, NgIconComponent],
  templateUrl: './show-user-features.component.html',
  viewProviders: [provideIcons({ phosphorArrowSquareOut })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowUserFeaturesComponent {
  private readonly store = inject(Store);
  private readonly featuresService = inject(FeaturesService);

  protected activeAccount = this.store.selectSignal(
    sharedFeature.selectActiveAccount
  );

  protected readonly features = computed(() => {
    const allFeatures = this.featuresService
      .getAllFeatures()
      .sort((a, b) => a.stage.toString().localeCompare(b.stage.toString()))
      .reverse();
    const featureAccount = {
      settings: allFeatures
        .map(feature => ({
          key: feature.key,
          value: this.activeAccount()?.settings[feature.key] === 'true',
        }))
        .reduce((prev, curr) => ({ ...prev, [curr.key]: curr.value }), {}),
    };
    return allFeatures.map(feature => ({
      name: feature.name,
      key: feature.key,
      description: feature.description,
      stage: feature.stage,
      link: feature.link,
      isActive: feature.canShow(featureAccount),
    }));
  });

  changeFeature(feature: ViewFeature, event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const accountId = this.activeAccount()?.id;
    const settings = this.activeAccount()?.settings;

    if (accountId && settings) {
      this.store.dispatch(
        AccountActions.updateOneSetting({
          key: feature.key,
          value: input.checked ? 'true' : 'false',
          accountId: accountId,
          settings: settings,
        })
      );
    }
  }
}
