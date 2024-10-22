import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EnvironmentType } from '../../../environments/environment.types';

@Component({
  selector: 'app-development',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './development.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentComponent {
  shouldShow() {
    return environment.type === EnvironmentType.development;
  }
}
