import { Clipboard } from '@angular/cdk/clipboard';
import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { SharedAuthTokenService } from '../../../../shared/services/auth-token.service';
import { NavigationActions } from '../../../../shared/store/navigation/navigation.actions';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { HeaderCurrentAccountComponent } from '../../../non-authorized/user/shared/header-current-account/header-current-account.component';
import { HeaderLoginButtonComponent } from '../../../non-authorized/user/shared/header-login-button/header-login-button.component';
import { ModalWindowActions } from '../store/modal-window/modal-window.actions';
import { ModalWindowType } from '../store/modal-window/modal-window.types';
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
  private readonly authService = inject(SharedAuthTokenService);
  private readonly clipboard = inject(Clipboard);
  private readonly themeService = inject(ThemeService);
  private readonly notificationStore = inject(NotificationStore);

  private readonly canUseCookies = this.store.selectSignal(
    sharedFeature.canUseNecessaryCookies
  );

  protected token = this.authService.token;

  protected readonly isLoading = signal(false);
  protected readonly isOpenMenu = signal(false);

  protected isAuthorized = this.store.selectSignal(sharedFeature.isAuthorized);
  protected activeAccount = this.store.selectSignal(
    sharedFeature.selectActiveAccount
  );
  protected activeAccountSettings = this.store.selectSignal(
    sharedFeature.selectActiveAccountFeatureSettings
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
    this.store.dispatch(SharedActions.logout());
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
