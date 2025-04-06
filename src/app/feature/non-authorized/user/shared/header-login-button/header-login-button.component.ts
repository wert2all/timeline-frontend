import { Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorUserCircleDashed } from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-shared-header-login-button',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './header-login-button.component.html',
  viewProviders: [provideIcons({ phosphorUserCircleDashed })],
})
export class HeaderLoginButtonComponent {
  isLoading = input.required<boolean>();
  login = output();
}
