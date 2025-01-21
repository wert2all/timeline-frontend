import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { LoginRedirectPageComponent } from './components/redirect-page/redirect-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'redirect', component: LoginRedirectPageComponent },
];
