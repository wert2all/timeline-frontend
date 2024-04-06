import { Component } from '@angular/core';
import { NoAuthorizedLayoutComponent } from '../../layout/no-authorized/no-authorized-layout.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [NoAuthorizedLayoutComponent],
})
export class LoginPageComponent {}
