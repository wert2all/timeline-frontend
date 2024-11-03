import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import { ModalComponent } from '../../../../share/modal/modal.component';
import { Feature, FeaturesService } from '../../../features.service';
import { FeatureStageComponent } from '../feature-stage/feature-stage.component';

@Component({
  selector: 'app-show-user-features',
  standalone: true,
  imports: [CommonModule, ModalComponent, FeatureStageComponent],
  templateUrl: './show-user-features.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowUserFeaturesComponent {
  private readonly featuresService = inject(FeaturesService);
  showFeatures = input(false);

  save = output<{ name: string; active: boolean }>();
  onClose = output();

  protected readonly features = this.featuresService.getAllFeatures();

  changeFeature(feature: Feature, event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    this.save.emit({ name: feature.name, active: input.checked });
  }
}
