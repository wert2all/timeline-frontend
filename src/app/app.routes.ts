import { Routes } from '@angular/router';
import { maybeAuthGuard } from './libs/maybe-auth.guard';
import { MyPageComponent } from './pages/authorized/my/my-page.component';
import { DevelopPageComponent } from './pages/non-authorized/develop/develop-page.component';
import { IndexPageComponent } from './pages/non-authorized/index/index-page.component';
import { LoginPageComponent } from './pages/non-authorized/login/login-page.component';

export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  {
    path: 'user/login',
    component: LoginPageComponent,
  },
  {
    path: 'develop',
    component: DevelopPageComponent,
  },
  {
    path: 'my',
    component: MyPageComponent,
    canActivate: [maybeAuthGuard],
  },
];
