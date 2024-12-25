import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FeatureFlagName } from '../../../feature/features.service';
import { ThemeSwitchComponent } from '../../../feature/ui/theme/theme-switch.component';
import { FeatureFlagComponent } from '../../../feature/user/features/feature-flag/feature-flag.component';
import { TopMenuComponent } from '../../../feature/user/top-menu/top-menu.component';
import { AuthService } from '../../../services/auth.service';
import { AccountActions } from '../../../store/account/account.actions';
import { accountFeature } from '../../../store/account/account.reducer';
import { AuthActions } from '../../../store/auth/auth.actions';
import { NavigationActions } from '../../../store/navigation/navigation.actions';
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
  private readonly authService = inject(AuthService);

  protected isLoading = signal(false);
  protected isAuthorized = this.store.selectSignal(accountFeature.isAuthorized);
  protected token = this.authService.idToken;
  protected activeAccount = this.store.selectSignal(
    accountFeature.selectActiveAccount
  );

  protected activeAccountSettings = this.store.selectSignal(
    accountFeature.selectActiveAccountFeaturesSettings
  );

  login() {
    this.store.dispatch(NavigationActions.toLogin());
  }

  logout() {
    this.store.dispatch(AuthActions.dispatchLogout());
  }

  goToDashboard() {
    this.store.dispatch(NavigationActions.toUserDashboard());
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
