import { Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

import { NoAuthorizedLayoutComponent } from '../../../layout/no-authorized/no-authorized-layout.component';
import { LoginContainerComponent } from './widgets/login/login-container.component';
@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [
    NoAuthorizedLayoutComponent,
    NgIconComponent,
    LoginContainerComponent,
  ],
})
export class LoginPageComponent {}
