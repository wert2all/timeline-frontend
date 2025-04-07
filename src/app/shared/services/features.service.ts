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
  link: URL | null;
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
    stage: FeatureStage.development,
    link: null,
    canShow: account => canShow(account, 'user_settings'),
  },
  show_user_accounts: {
    name: 'Accounts',
    description: 'Show user accounts',
    stage: FeatureStage.started,
    link: null,
    canShow: account => canShow(account, 'show_user_accounts'),
  },
  event_links: {
    name: 'Link to event',
    description: 'Event could have links to itself',
    stage: FeatureStage.started,
    link: URL.parse('https://github.com/wert2all/timeline-frontend/pull/526'),
    canShow: account => canShow(account, 'event_links'),
  },
  event_likes: {
    name: 'Event likes',
    description: 'Every event could have likes from other users',
    stage: FeatureStage.started,
    link: null,
    canShow: account => canShow(account, 'event_likes'),
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
