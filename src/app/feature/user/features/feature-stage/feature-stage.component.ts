import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FeatureStage } from '../../../features.service';

type View = {
  title: string;
  stage: string;
};
@Component({
  selector: 'app-feature-stage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-stage.component.html',
  styleUrls: ['./feature-stage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureStageComponent {
  stage = input.required<FeatureStage>();

  protected readonly view = computed<View | undefined>(() => {
    switch (this.stage()) {
      case FeatureStage.started:
        return { title: 'started', stage: 'started' };
      case FeatureStage.development:
        return { title: 'development', stage: 'development' };
      case FeatureStage.testing:
        return { title: 'testing', stage: 'testing' };
      case FeatureStage.done:
        return { title: 'done', stage: 'done' };
      default:
        return undefined;
    }
  });
}
