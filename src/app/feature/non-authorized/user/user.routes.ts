import { Routes } from '@angular/router';
import { LoginPageComponent } from './login/login-page.component';
import { LoginRedirectPageComponent } from './redirect/redirect.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'redirect', component: LoginRedirectPageComponent },
];
