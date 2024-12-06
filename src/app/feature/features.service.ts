import { Injectable } from '@angular/core';
import { PartialRecord } from '../app.types';

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export enum FeatureStage {
  started,
  development,
  testing,
  done,
}
export type AccountFeaturesSettings = PartialRecord<FeatureFlagName, boolean>;

export type FeaturesAccount = {
  settings: AccountFeaturesSettings;
};

export interface Feature {
  name: string;
  description: string;
  stage: FeatureStage;
  canShow(account: FeaturesAccount): boolean;
}

const canShow = (account: FeaturesAccount, flag: string): boolean =>
  account.settings[flag as FeatureFlagName] === true;

const FEATURE_FLAGS = {
  dark_light_mode: {
    name: 'Dark/Light mode',
    description: 'Toggle between dark and light mode',
    canShow: account => canShow(account, 'dark_light_mode'),
    stage: FeatureStage.development,
  },
  user_settings: {
    name: 'User settings',
    description: 'Change user profile settings',
    stage: FeatureStage.started,
    canShow: account => canShow(account, 'user_settings'),
  },
  user_feature_flag: {
    name: 'Features',
    description: 'Change some features of application.',
    stage: FeatureStage.development,
    canShow: account => canShow(account, 'user_feature_flag'),
  },
  show_user_accounts: {
    name: 'Accounts',
    description: 'Show user accounts',
    canShow: account => canShow(account, 'show_user_accounts'),
    stage: FeatureStage.started,
  },
} as const satisfies Record<string, Feature>;

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  getAllFeatures(): (Feature & { key: FeatureFlagName })[] {
    return Object.keys(FEATURE_FLAGS).map(key => ({
      ...FEATURE_FLAGS[key as FeatureFlagName],
      key: key as FeatureFlagName,
    }));
  }

  canShow(feature: FeatureFlagName, account: FeaturesAccount): boolean {
    return this.getFeature(feature)?.canShow(account) || false;
  }

  private getFeature(feature: FeatureFlagName): Feature | undefined {
    return FEATURE_FLAGS[feature];
  }
}
