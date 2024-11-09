import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxGhostOutline, saxMenu1Outline } from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { FeatureFlagComponent } from '../../../feature/flag/feature-flag/feature-flag.component';
import { ThemeSwitchComponent } from '../../../feature/ui/theme/theme-switch.component';
import { ShowUserFeaturesComponent } from '../../../feature/user/features/show-user-features/show-user-features.component';
import { TopMenuComponent } from '../../../feature/user/top-menu/top-menu.component';
import { AuthActions } from '../../../store/auth/auth.actions';
import { authFeature } from '../../../store/auth/auth.reducer';
import { LegacyUserButtonComponent } from './legacy-user-button/legacy-user-button.component';
import { CopyTokenComponent } from './top-menu/copy-token/copy-token.component';
import { LoginButtonComponent } from './top-menu/login-button/login-button.component';
import { LogoutButtonComponent } from './top-menu/logout-button/logout-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  viewProviders: [provideIcons({ saxMenu1Outline, saxGhostOutline })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TopMenuComponent,
    NgIconComponent,
    LoginButtonComponent,
    LogoutButtonComponent,
    CopyTokenComponent,
    FeatureFlagComponent,
    ShowUserFeaturesComponent,
    ThemeSwitchComponent,
    LegacyUserButtonComponent,
  ],
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  isLoading = this.store.selectSignal(authFeature.isLoading);
  isAuthorized = this.store.selectSignal(authFeature.isAuthorized);
  token = this.store.selectSignal(authFeature.selectToken);
  activeAccount = this.store.selectSignal(authFeature.selectActiveAccount);

  login() {
    this.router.navigate(['user', 'login']);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  goToDashboard() {
    this.router.navigate(['my']);
  }
}
