import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FeatureFlagName,
  FeaturesService,
} from '../../../feature/features.service';
import { ThemeSwitchComponent } from '../../../feature/ui/theme/theme-switch.component';
import { FeatureFlagComponent } from '../../../feature/user/features/feature-flag/feature-flag.component';
import { ShowUserFeaturesComponent } from '../../../feature/user/features/show-user-features/show-user-features.component';
import { AuthService } from '../../../services/auth.service';
import { AccountActions } from '../../../store/account/account.actions';
import { accountFeature } from '../../../store/account/account.reducer';
import { AuthActions } from '../../../store/auth/auth.actions';
import { NavigationActions } from '../../../store/navigation/navigation.actions';
import { CollapsableMenuComponent } from './collapsable-menu/collapsable-menu.compoment';
import { CurrentAccountComponent } from './current-account/current-account.component';
import { LoginButtonComponent } from './login-button/login-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LoginButtonComponent,
    FeatureFlagComponent,
    ThemeSwitchComponent,
    ShowUserFeaturesComponent,
    CurrentAccountComponent,
    CollapsableMenuComponent,
  ],
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly featuresService = inject(FeaturesService);
  private readonly clipboard = inject(Clipboard);

  protected token = this.authService.idToken;

  protected readonly isLoading = signal(false);
  protected readonly isOpenMenu = signal(false);
  protected readonly showFeatures = signal(false);

  protected isAuthorized = this.store.selectSignal(accountFeature.isAuthorized);
  protected activeAccount = this.store.selectSignal(
    accountFeature.selectActiveAccount
  );
  protected activeAccountSettings = this.store.selectSignal(
    accountFeature.selectActiveAccountFeaturesSettings
  );

  protected readonly allFeatures = computed(() => {
    const allFeatures = this.featuresService
      .getAllFeatures()
      .sort((a, b) => a.stage.toString().localeCompare(b.stage.toString()))
      .reverse();
    const featureAccount = {
      settings: allFeatures
        .map(feature => ({
          key: feature.key,
          value: this.activeAccount()?.settings[feature.key] === 'true',
        }))
        .reduce((prev, curr) => ({ ...prev, [curr.key]: curr.value }), {}),
    };
    return allFeatures.map(feature => ({
      name: feature.name,
      key: feature.key,
      description: feature.description,
      stage: feature.stage,
      isActive: feature.canShow(featureAccount),
    }));
  });
  protected readonly currentAccountView = computed(() => {
    const account = this.activeAccount();
    return account
      ? {
          uuid: account.id.toString(),
          name: account.name || 'John Doe',
          firstLetter: account.name?.charAt(0).toUpperCase() || 'J',
          avatar: account.avatar,
        }
      : null;
  });

  openMenu() {
    this.isOpenMenu.set(!this.isOpenMenu());
    this.goToDashboard();
  }

  closeMenu() {
    this.isOpenMenu.set(false);
  }

  openUserFeatures() {
    this.showFeatures.set(true);
    this.isOpenMenu.set(false);
  }

  copyTokenToClipboard() {
    if (this.token) {
      this.clipboard.copy(this.token);
    }
  }

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
