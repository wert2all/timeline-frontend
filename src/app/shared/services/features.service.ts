import { Injectable } from '@angular/core';
import { PartialRecord } from '../../app.types';

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export enum FeatureStage {
  started,
  development,
  testing,
  done,
}
export type AccountFeaturesSettings = PartialRecord<FeatureFlagName, boolean>;

export interface FeaturesAccount {
  settings: AccountFeaturesSettings;
}

export interface Feature {
  name: string;
  description: string;
  stage: FeatureStage;
  canShow(account: FeaturesAccount): boolean;
}

const getStage = (flag: string): FeatureStage =>
  FEATURE_FLAGS[flag as FeatureFlagName].stage;

const canShow = (account: FeaturesAccount, flag: string): boolean =>
  getStage(flag) === FeatureStage.done ||
  account.settings[flag as FeatureFlagName] === true;

const FEATURE_FLAGS = {
  user_settings: {
    name: 'User settings',
    description: 'Change user profile settings',
    canShow: account => canShow(account, 'user_settings'),
    stage: FeatureStage.development,
  },
  show_user_accounts: {
    name: 'Accounts',
    description: 'Show user accounts',
    canShow: account => canShow(account, 'show_user_accounts'),
    stage: FeatureStage.started,
  },
  event_likes: {
    name: 'Event likes',
    description: 'Every event could have likes from other users',
    canShow: account => canShow(account, 'event_likes'),
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
