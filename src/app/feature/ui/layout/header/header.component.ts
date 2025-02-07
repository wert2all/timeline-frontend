import { Clipboard } from '@angular/cdk/clipboard';
import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClickOutside } from 'ngxtension/click-outside';
import { Unique } from '../../../../app.types';
import { NavigationActions } from '../../../../shared/store/navigation/navigation.actions';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { toAccountView } from '../../../account/account.functions';
import { AccountView } from '../../../account/account.types';
import { SharedAccountViewComponent } from '../../../account/share/view/account-view.component';
import { AuthFacade } from '../../../auth/auth.facade';
import { HeaderLoginButtonComponent } from '../../../non-authorized/user/shared/header-login-button/header-login-button.component';
import { ModalWindowActions } from '../store/modal-window/modal-window.actions';
import { ModalWindowType } from '../store/modal-window/modal-window.types';
import { NotificationStore } from '../store/notification/notifications.store';
import { ThemeService } from '../theme.service';
import { CollapsableMenuComponent } from './collapsable-menu/collapsable-menu.compoment';
import { HeaderThemeSwitchComponent } from './theme-switch/header-theme-switch.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    HeaderLoginButtonComponent,
    HeaderThemeSwitchComponent,
    SharedAccountViewComponent,
    CollapsableMenuComponent,
    ClickOutside,
  ],
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly tokenProvider = inject(AuthFacade);
  private readonly clipboard = inject(Clipboard);
  private readonly themeService = inject(ThemeService);
  private readonly notificationStore = inject(NotificationStore);
  private readonly canUseCookies = this.store.selectSignal(
    sharedFeature.canUseNecessaryCookies
  );

  protected token = this.tokenProvider.getToken();

  protected readonly isLoading = signal(false);
  protected readonly isOpenMenu = signal(false);

  protected isAuthorized = this.store.selectSignal(sharedFeature.isAuthorized);
  protected activeAccount = this.store.selectSignal(
    sharedFeature.selectActiveAccount
  );
  protected activeAccountSettings = this.store.selectSignal(
    sharedFeature.selectActiveAccountFeatureSettings
  );

  protected readonly currentAccountView = computed(() =>
    toAccountView(this.activeAccount())
  );

  protected readonly isDarkTheme = this.themeService.isDark;
  protected readonly userAccounts = this.store.selectSignal(
    sharedFeature.selectUserAccounts
  );
  protected readonly userAccountsViews = computed((): AccountView[] =>
    this.userAccounts()
      .map(account => toAccountView(account))
      .filter(account => !!account)
  );

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

  changeAccount(switchToAccount: Unique) {
    const selectedAccount = this.userAccounts().find(
      account => account.id.toString() === switchToAccount.uuid
    );

    if (selectedAccount) {
      this.store.dispatch(
        SharedActions.switchActiveAccount({ account: selectedAccount })
      );
    }
  }
}
