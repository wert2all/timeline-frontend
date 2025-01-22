import { Routes } from '@angular/router';
import { MyPageComponent } from './feature/authorized/dashboard/my-page.component';
import { DevelopPageComponent } from './feature/non-authorized/develop/develop-page.component';
import { IndexPageComponent } from './feature/non-authorized/index/index-page.component';
import { maybeAuthGuard } from './libs/maybe-auth.guard';

export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  {
    path: 'legal',
    loadChildren: () =>
      import('./feature/non-authorized/legal/legal.routes').then(l => l.routes),
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./feature/non-authorized/user/user.routes').then(u => u.routes),
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
