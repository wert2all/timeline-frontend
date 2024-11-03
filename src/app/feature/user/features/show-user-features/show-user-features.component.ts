import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ModalComponent } from '../../../../share/modal/modal.component';
import { FeaturesService } from '../../../features.service';
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

  protected readonly features = this.featuresService.getAllFeatures();
}
