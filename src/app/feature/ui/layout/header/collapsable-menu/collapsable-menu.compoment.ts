import { Component, computed, input, output, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  phosphorBug,
  phosphorCheckCircle,
  phosphorCopy,
  phosphorFlagBanner,
  phosphorGearSix,
  phosphorSignOut,
  phosphorUserSwitch,
} from '@ng-icons/phosphor-icons/regular';
import { Unique } from '../../../../../app.types';
import { AccountFeaturesSettings } from '../../../../../shared/services/features.service';
import { AccountView } from '../../../../account/account.types';
import { FeatureFlagComponent } from '../../../feature-flag/feature-flag.component';

@Component({
  standalone: true,
  selector: 'app-top-menu-collapsable-menu',
  templateUrl: './collapsable-menu.compoment.html',
  styleUrls: ['./collapsable-menu.compoment.scss'],
  imports: [FeatureFlagComponent, NgIconComponent],
  viewProviders: [
    provideIcons({
      phosphorSignOut,
      phosphorCheckCircle,
      phosphorBug,
      phosphorUserSwitch,
      phosphorCopy,
      phosphorFlagBanner,
      phosphorGearSix,
    }),
  ],
})
export class CollapsableMenuComponent {
  currentAccountUUID = input.required<string>();
  accountSettings = input.required<AccountFeaturesSettings>();
  accounts = input.required<AccountView[]>();
  isOpenMenu = input(false);

  changeAccount = output<Unique>();
  copyToken = output<void>();
  closeMenu = output<void>();

  openUserFeatures = output<void>();
  openUserSettings = output<void>();

  logout = output<void>();

  protected readonly isCopied = signal(false);
  protected readonly isAccountChange = signal(false);
  protected readonly copyIcon = computed(() =>
    this.isCopied() ? 'phosphorCheckCircle' : 'phosphorCopy'
  );

  changeAccountClick() {
    this.isAccountChange.set(!this.isAccountChange());
  }

  selectAccountClick(account: AccountView) {
    this.changeAccount.emit(account);
    this.changeAccountClick();
  }

  copyToClipboard() {
    this.isCopied.set(true);
    setTimeout(() => {
      this.isCopied.set(false);
    }, 3000);
    this.copyToken.emit();
  }
}
