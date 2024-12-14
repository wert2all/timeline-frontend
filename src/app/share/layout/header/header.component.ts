import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FeatureFlagName } from '../../../feature/features.service';
import { ThemeSwitchComponent } from '../../../feature/ui/theme/theme-switch.component';
import { FeatureFlagComponent } from '../../../feature/user/features/feature-flag/feature-flag.component';
import { TopMenuComponent } from '../../../feature/user/top-menu/top-menu.component';
import { AccountActions } from '../../../store/account/account.actions';
import { accountFeature } from '../../../store/account/account.reducer';
import { AuthStorageService } from '../../../store/auth/auth-storage.service';
import { AuthActions } from '../../../store/auth/auth.actions';
import { authFeature } from '../../../store/auth/auth.reducer';
import { LoginButtonComponent } from './login-button/login-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TopMenuComponent,
    LoginButtonComponent,
    FeatureFlagComponent,
    ThemeSwitchComponent,
  ],
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly authStorage = inject(AuthStorageService);

  protected isLoading = this.store.selectSignal(authFeature.isLoading);
  protected isAuthorized = this.store.selectSignal(accountFeature.isAuthorized);
  protected token = this.authStorage.getToken();
  protected activeAccount = this.store.selectSignal(
    accountFeature.selectActiveAccount
  );

  protected activeAccountSettings = this.store.selectSignal(
    accountFeature.selectActiveAccountFeaturesSettings
  );
  login() {
    this.router.navigate(['user', 'login']);
  }

  logout() {
    this.store.dispatch(AuthActions.dispatchLogout());
  }

  goToDashboard() {
    this.router.navigate(['my']);
  }

  saveFeature($event: { feature: FeatureFlagName; isActive: boolean }) {
    this.store.dispatch(
      AccountActions.updateOneSetting({
        key: $event.feature,
        value: $event.isActive ? 'true' : 'false',
      })
    );
  }
}
