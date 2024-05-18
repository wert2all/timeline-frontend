import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLogout1Outline } from '@ng-icons/iconsax/outline';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './logout-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxLogout1Outline })],
})
export class LogoutButtonComponent {
  isAuthorized = input.required<boolean>();

  logout = output();
}
