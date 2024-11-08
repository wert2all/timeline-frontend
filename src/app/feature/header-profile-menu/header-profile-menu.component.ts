import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxCopyOutline,
  saxCopySuccessOutline,
  saxFlag2Outline,
  saxGhostOutline,
  saxLogout1Outline,
  saxProfile2userOutline,
  saxSetting2Outline,
} from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/auth/auth.actions';
import { authFeature } from '../../store/auth/auth.reducer';
import { FeatureFlagComponent } from '../flag/feature-flag/feature-flag.component';
import { MenuAccountsComponent } from '../user/accounts/menu-accounts/menu-accounts.component';
import { ShowUserFeaturesComponent } from '../user/features/show-user-features/show-user-features.component';

@Component({
  selector: 'app-header-profile-menu',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent,
    FeatureFlagComponent,
    ShowUserFeaturesComponent,
    MenuAccountsComponent,
  ],
  templateUrl: './header-profile-menu.component.html',
  styleUrls: ['./header-profile-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      saxFlag2Outline,
      saxLogout1Outline,
      saxSetting2Outline,
      saxCopyOutline,
      saxGhostOutline,
      saxCopySuccessOutline,
      saxProfile2userOutline,
    }),
  ],
})
export class HeaderProfileMenuComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly clipboard: Clipboard = inject(Clipboard);
  private readonly activeAccount = this.store.selectSignal(
    authFeature.selectActiveAccount
  );

  protected readonly isLoading = this.store.selectSignal(authFeature.isLoading);
  protected readonly authorizedUser = this.store.selectSignal(
    authFeature.selectAuthorizedUser
  );
  protected readonly token = this.store.selectSignal(authFeature.selectToken);

  protected readonly isCopied = signal(false);
  protected readonly showFeatures = signal(false);

  protected readonly copyIcon = computed(() =>
    this.isCopied() ? 'saxCopySuccessOutline' : 'saxCopyOutline'
  );

  protected readonly currentAccount = computed(() => {
    const activeAccount = this.activeAccount();
    return activeAccount
      ? {
          uuid: activeAccount.id.toString(),
          name: activeAccount.name || 'John Doe',
          firstLetter: activeAccount.name?.charAt(0).toUpperCase() || 'J',
        }
      : null;
  });
  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  goToDashboard() {
    this.router.navigate(['my']);
  }

  copyToClipboard() {
    const token = this.token();
    if (token) {
      this.clipboard.copy(token);
      this.isCopied.set(true);
    }
  }

  saveFeature(event: { name: string; active: boolean }) {
    console.log(event);
  }
}
