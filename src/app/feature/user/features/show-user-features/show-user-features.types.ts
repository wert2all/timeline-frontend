import { FeatureStage } from '../../../features.service';

export interface UserFeature {
  name: string;
  description: string;
  stage: FeatureStage;
  isActive: boolean;
}
