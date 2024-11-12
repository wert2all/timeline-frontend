import { Injectable } from '@angular/core';

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export enum FeatureStage {
  started,
  development,
  testing,
  done,
}

export interface Feature {
  name: string;
  description: string;
  stage: FeatureStage;
  canShow(): boolean;
}
const isActive = false;
const FEATURE_FLAGS = {
  dark_light_mode: {
    name: 'Dark/Light mode',
    description: 'Toggle between dark and light mode',
    canShow: () => isActive,
    stage: FeatureStage.development,
  },
  edit_event: {
    name: 'Edit event',
    description: 'Update exist event',
    canShow: () => true,
    stage: FeatureStage.testing,
  },
  user_settings: {
    name: 'User settings',
    description: 'Change user profile settings',
    canShow: () => isActive,
    stage: FeatureStage.started,
  },
  user_feature_flag: {
    name: 'Features',
    description: 'Change some features of application.',
    canShow: () => isActive,
    stage: FeatureStage.development,
  },
  show_user_accounts: {
    name: 'Accounts',
    description: 'Show user accounts',
    canShow: () => isActive,
    stage: FeatureStage.started,
  },
} as const satisfies Record<string, Feature>;

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  getAllFeatures(): Feature[] {
    return Object.values(FEATURE_FLAGS);
  }
  canShow(feature: FeatureFlagName): boolean {
    return this.getFeature(feature)?.canShow() || false;
  }

  private getFeature(feature: FeatureFlagName): Feature | undefined {
    return FEATURE_FLAGS[feature];
  }
}
