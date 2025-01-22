import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginRedirectPageComponent } from './redirect-page/redirect-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'redirect', component: LoginRedirectPageComponent },
];
