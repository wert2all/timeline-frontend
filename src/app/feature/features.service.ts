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
  FEATURE_FLAGS[flag as FeatureFlagName].stage === FeatureStage.done ||
  account.settings[flag as FeatureFlagName] === true;

const FEATURE_FLAGS = {
  dark_light_mode: {
    name: 'Dark/Light mode',
    description: 'Toggle between dark and light mode',
    canShow: account => canShow(account, 'dark_light_mode'),
    stage: FeatureStage.done,
  },
  user_settings: {
    name: 'User settings',
    description: 'Change user profile settings',
    canShow: account => canShow(account, 'user_settings'),
    stage: FeatureStage.started,
  },
  user_feature_flag: {
    name: 'Features',
    description: 'Change some features of application.',
    canShow: account => canShow(account, 'user_feature_flag'),
    stage: FeatureStage.done,
  },
  show_user_accounts: {
    name: 'Accounts',
    description: 'Show user accounts',
    canShow: account => canShow(account, 'show_user_accounts'),
    stage: FeatureStage.started,
  },
  upload_images: {
    name: 'Upload images',
    description: 'Upload images and assign to events',
    canShow: account => canShow(account, 'upload_images'),
    stage: FeatureStage.testing,
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
