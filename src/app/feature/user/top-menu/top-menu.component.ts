import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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
import { Unique } from '../../../app.types';
import { Account } from '../../../store/auth/auth.types';
import { FeatureFlagName } from '../../features.service';
import { FeatureFlagComponent } from '../../flag/feature-flag/feature-flag.component';
import { ShowUserFeaturesComponent } from '../features/show-user-features/show-user-features.component';

type AccountView = Unique & {
  name: string;
  firstLetter: string;
  avatar?: string;
};

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  standalone: true,
  imports: [FeatureFlagComponent, NgIconComponent, ShowUserFeaturesComponent],
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
export class TopMenuComponent {
  changeAccount = output<Unique>();
  accountClick = output<void>();
  saveFeature = output<{ feature: FeatureFlagName; isActive: boolean }>();
  logout = output<void>();

  authorizedUserToken = input.required<string>();
  activeAccount = input.required<Account>();

  accounts = input<Account[]>([]);

  private readonly clipboard: Clipboard = inject(Clipboard);

  protected readonly isCopied = signal(false);
  protected readonly showFeatures = signal(false);
  protected readonly isAccountChange = signal(false);
  protected readonly isOpenMenu = signal(false);

  protected readonly copyIcon = computed(() =>
    this.isCopied() ? 'saxCopySuccessOutline' : 'saxCopyOutline'
  );

  protected readonly currentAccount = computed(() => {
    return this.toAccountView(this.activeAccount());
  });

  protected readonly userAccounts = computed<AccountView[]>(() =>
    this.accounts()
      .map(account => this.toAccountView(account))
      .filter(acc => !!acc)
  );

  copyToClipboard() {
    this.clipboard.copy(this.authorizedUserToken());
    this.isCopied.set(true);
  }

  saveFeatureClick(event: { name: string; active: boolean }) {
    console.log(event);
  }

  changeAccountClick() {
    this.isAccountChange.set(!this.isAccountChange());
  }

  selectAccountClick(account: AccountView) {
    this.changeAccount.emit(account);
    this.changeAccountClick();
  }

  openMenu() {
    this.isOpenMenu.set(!this.isOpenMenu());
    this.accountClick.emit();
  }

  private toAccountView(account: Account): AccountView {
    return {
      uuid: account.id.toString(),
      name: account.name || 'John Doe',
      firstLetter: account.name?.charAt(0).toUpperCase() || 'J',
      avatar: account.avatar,
    };
  }
}
