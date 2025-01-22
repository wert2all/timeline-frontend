import { Component, computed, input, output, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxArrowLeft3Outline,
  saxArrowLeftOutline,
  saxArrowRight2Outline,
  saxArrowRightOutline,
  saxCopyOutline,
  saxCopySuccessOutline,
  saxFlag2Outline,
  saxGhostOutline,
  saxLogout1Outline,
  saxProfile2userOutline,
  saxSetting2Outline,
  saxTickCircleOutline,
} from '@ng-icons/iconsax/outline';
import { Unique } from '../../../../../app.types';
import { AccountFeaturesSettings } from '../../../../../shared/services/features.service';
import { FeatureFlagComponent } from '../../../feature-flag/feature-flag.component';
import { AccountView } from '../header.types';

@Component({
  standalone: true,
  selector: 'app-top-menu-collapsable-menu',
  templateUrl: './collapsable-menu.compoment.html',
  styleUrls: ['./collapsable-menu.compoment.scss'],
  imports: [FeatureFlagComponent, NgIconComponent],
  viewProviders: [
    provideIcons({
      saxFlag2Outline,
      saxLogout1Outline,
      saxSetting2Outline,
      saxCopyOutline,
      saxGhostOutline,
      saxArrowRightOutline,
      saxArrowLeftOutline,
      saxCopySuccessOutline,
      saxProfile2userOutline,
      saxTickCircleOutline,
      saxArrowLeft3Outline,
      saxArrowRight2Outline,
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
    this.isCopied() ? 'saxCopySuccessOutline' : 'saxCopyOutline'
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
