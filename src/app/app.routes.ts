import { Routes } from '@angular/router';
import { maybeAuthGuard } from './libs/maybe-auth.guard';
import { MyPageComponent } from './pages/authorized/my/my-page.component';
import { DevelopPageComponent } from './pages/non-authorized/develop/develop-page.component';
import { IndexPageComponent } from './pages/non-authorized/index/index-page.component';
import { LoginPageComponent } from './pages/non-authorized/login/login-page.component';
import { LoginRedirectPageComponent } from './pages/non-authorized/redirect/redirect.component';

export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  {
    path: 'legal',
    loadChildren: () =>
      import('./feature/non-authorized/legal/legal.routes').then(m => m.routes),
  },
  {
    path: 'user/login',
    children: [
      { path: '', component: LoginPageComponent },
      { path: 'redirect', component: LoginRedirectPageComponent },
    ],
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
