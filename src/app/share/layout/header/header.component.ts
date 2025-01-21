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
import { ThemeSwitchComponent } from '../../../feature/ui/theme/theme-switch.component';
import { ClickOutsideDirective } from '../../../libs/click-outside.directive';
import { AuthService } from '../../../services/auth.service';
import { accountFeature } from '../../../store/account/account.reducer';
import { ApplicationActions } from '../../../store/application/application.actions';
import { ModalWindowType } from '../../../store/application/application.types';
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
    ThemeSwitchComponent,
    CurrentAccountComponent,
    CollapsableMenuComponent,
    ClickOutsideDirective,
  ],
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly clipboard = inject(Clipboard);

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
    this.store.dispatch(
      ApplicationActions.opensModalWindow({
        windowType: ModalWindowType.FEATURES,
      })
    );
    this.isOpenMenu.set(false);
  }

  openUserSettings() {
    this.store.dispatch(
      ApplicationActions.opensModalWindow({
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
}
