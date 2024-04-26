import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxMenu1Outline } from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/auth/auth.actions';
import { authFeature } from '../../store/auth/auth.reducer';
import { LoginButtonComponent } from './top-menu/login-button/login-button.component';
import { LogoutButtonComponent } from './top-menu/logout-button/logout-button.component';
import { ProfileButtonComponent } from './top-menu/profile-button/profile-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  viewProviders: [provideIcons({ saxMenu1Outline })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgIconComponent,
    LoginButtonComponent,
    ProfileButtonComponent,
    LogoutButtonComponent,
  ],
})
export class HeaderComponent {
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
