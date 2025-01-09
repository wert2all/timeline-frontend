import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLoginOutline } from '@ng-icons/iconsax/outline';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './login-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxLoginOutline })],
})
export class LoginButtonComponent {
  isLoading = input.required<boolean>();
  login = output();
}
