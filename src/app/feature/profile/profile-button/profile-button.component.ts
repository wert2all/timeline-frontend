import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { FeatureFlagComponent } from '../../flag/feature-flag/feature-flag.component';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent, FeatureFlagComponent],
  templateUrl: './profile-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({})],
})
export class ProfileButtonComponent {
  isLoading = input.required<boolean>();
  user = input.required<{ avatar: string; name: string | null } | null>();

  toProfile = output();
}
