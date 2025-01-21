import { Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLoginOutline } from '@ng-icons/iconsax/outline';

@Component({
  selector: 'app-shared-header-login-button',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './header-login-button.component.html',
  viewProviders: [provideIcons({ saxLoginOutline })],
})
export class HeaderLoginButtonComponent {
  isLoading = input.required<boolean>();
  login = output();
}
