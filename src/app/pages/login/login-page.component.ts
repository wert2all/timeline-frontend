import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { NoAuthorizedLayoutComponent } from '../../layout/no-authorized/no-authorized-layout.component';
import { saxLogin1Outline } from '@ng-icons/iconsax/outline';
@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [NoAuthorizedLayoutComponent, NgIconComponent],
  viewProviders: [provideIcons({ saxLogin1Outline })],
})
export class LoginPageComponent {}
