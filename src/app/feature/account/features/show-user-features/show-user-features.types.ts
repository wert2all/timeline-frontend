import { FeatureStage } from '../../../../shared/services/features.service';

export interface UserFeature {
  name: string;
  description: string;
  stage: FeatureStage;
  isActive: boolean;
}
