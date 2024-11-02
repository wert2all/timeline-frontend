import { Injectable } from '@angular/core';

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export interface Feature {
  name: string;
  description: string;
  canShow(): boolean;
}

const FEATURE_FLAGS = {
  edit_event: {
    name: '',
    description: '',
    canShow: () => false,
  },
  profile_dropdown: {
    name: '',
    description: '',
    canShow: () => false,
  },
  user_settings: {
    name: '',
    description: '',
    canShow: () => false,
  },
  user_feature_flag: {
    name: '',
    description: '',
    canShow: () => false,
  },
} as const satisfies Record<string, Feature>;

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  canShow(feature: FeatureFlagName): boolean {
    return this.getFeature(feature)?.canShow() || false;
  }

  private getFeature(feature: FeatureFlagName): Feature | undefined {
    return FEATURE_FLAGS[feature];
  }
}
