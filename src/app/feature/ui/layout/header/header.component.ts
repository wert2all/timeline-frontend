import { Clipboard } from '@angular/cdk/clipboard';
import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../services/auth.service';
import { sharedFeature } from '../../../../shared/store/shared.reducers';
import { accountFeature } from '../../../../store/account/account.reducer';
import { AuthActions } from '../../../../store/auth/auth.actions';
import { NavigationActions } from '../../../../store/navigation/navigation.actions';
import { ModalWindowActions } from '../../../authorized/dashboard/store/modal-window/modal-window.actions';
import { ModalWindowType } from '../../../authorized/dashboard/store/modal-window/modal-window.types';
import { HeaderCurrentAccountComponent } from '../../../non-authorized/user/shared/header-current-account/header-current-account.component';
import { HeaderLoginButtonComponent } from '../../../non-authorized/user/shared/header-login-button/header-login-button.component';
import { NotificationStore } from '../store/notification/notifications.store';
import { ThemeService } from '../theme.service';
import { ClickOutsideDirective } from './click-outside.directive';
import { CollapsableMenuComponent } from './collapsable-menu/collapsable-menu.compoment';
import { HeaderThemeSwitchComponent } from './theme-switch/header-theme-switch.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    HeaderLoginButtonComponent,
    HeaderThemeSwitchComponent,
    HeaderCurrentAccountComponent,
    CollapsableMenuComponent,
    ClickOutsideDirective,
  ],
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly clipboard = inject(Clipboard);
  private readonly themeService = inject(ThemeService);
  private readonly notificationStore = inject(NotificationStore);

  private readonly canUseCookies = this.store.selectSignal(
    sharedFeature.canUseNecessaryCookies
  );

  protected token = this.authService.idToken
    ? btoa(this.authService.idToken)
    : null;

  protected readonly isLoading = signal(false);
  protected readonly isOpenMenu = signal(false);

  protected isAuthorized = this.store.selectSignal(accountFeature.isAuthorized);
  protected activeAccount = this.store.selectSignal(
    accountFeature.selectActiveAccount
  );
  protected activeAccountSettings = this.store.selectSignal(
    accountFeature.selectActiveAccountFeaturesSettings
  );

  protected readonly currentAccountView = computed(() => {
    const account = this.activeAccount();
    return account
      ? {
          uuid: account.id.toString(),
          name: account.name || 'John Doe',
          firstLetter: account.name?.charAt(0).toUpperCase() || 'J',
        }
      : null;
  });

  protected readonly isDarkTheme = this.themeService.isDark;

  openMenu() {
    this.isOpenMenu.set(!this.isOpenMenu());
    this.goToDashboard();
  }

  closeMenu() {
    this.isOpenMenu.set(false);
  }

  openUserFeatures() {
    this.store.dispatch(
      ModalWindowActions.opensModalWindow({
        windowType: ModalWindowType.FEATURES,
      })
    );
    this.isOpenMenu.set(false);
  }

  openUserSettings() {
    this.store.dispatch(
      ModalWindowActions.opensModalWindow({
        windowType: ModalWindowType.SETTINGS,
      })
    );
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

  toggleTheme() {
    if (!this.canUseCookies()) {
      this.notificationStore.addMessage(
        'Please  accept cookies to save your theme choice',
        'warning'
      );
    }
    this.themeService.toggleTheme();
  }
}
