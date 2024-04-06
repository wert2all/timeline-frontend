import { Routes } from '@angular/router';
import { IndexPageComponent } from './pages/non-authorized/index/index-page.component';
import { LoginPageComponent } from './pages/non-authorized/login/login-page.component';

export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  {
    path: 'user/login',
    component: LoginPageComponent,
  },
];
