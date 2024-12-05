import { FeatureStage } from '../../../features.service';

export type UserFeature = {
  name: string;
  description: string;
  stage: FeatureStage;
  isActive: boolean;
};
