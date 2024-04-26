import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.actions';
import { authFeature } from '../../../store/auth/auth.reducer';

import { LoginButtonComponent } from './login-button/login-button.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';
import { ProfileButtonComponent } from './profile-button/profile-button.component';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  templateUrl: './top-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LogoutButtonComponent,
    ProfileButtonComponent,
    LoginButtonComponent,
  ],
})
export class TopMenuComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  isLoading = this.store.selectSignal(authFeature.isLoading);
  // isLoading = signal(true);
  isAuthorized = this.store.selectSignal(authFeature.isAuthorized);

  authorizedUser = this.store.selectSignal(authFeature.selectAuthorizedUser);

  login() {
    this.router.navigate(['user', 'login']);
  }
  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
