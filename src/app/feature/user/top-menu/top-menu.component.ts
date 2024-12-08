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
import { ClickOutsideDirective } from '../../../libs/click-outside.directive';
import { Account } from '../../../store/account/account.types';
import { FeatureFlagName, FeaturesService } from '../../features.service';
import { FeatureFlagComponent } from '../features/feature-flag/feature-flag.component';
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
  imports: [
    ClickOutsideDirective,
    FeatureFlagComponent,
    NgIconComponent,
    ShowUserFeaturesComponent,
  ],
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

  private readonly featuresService = inject(FeaturesService);
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

  protected readonly allFeatures = computed(() => {
    const allFeatures = this.featuresService
      .getAllFeatures()
      .sort((a, b) => a.stage.toString().localeCompare(b.stage.toString()))
      .reverse();
    const featureAccount = {
      settings: allFeatures
        .map(feature => ({
          key: feature.key,
          value: this.activeAccount().settings[feature.key] === 'true',
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

  protected activeAccountSettings = computed(() => {
    const settings: Record<string, string | boolean> = {};
    Object.entries(this.activeAccount().settings).forEach(([key, value]) => {
      if (value === 'true' || value === 'false') {
        settings[key] = value === 'true';
      } else {
        settings[key] = value;
      }
    });
    return settings;
  });

  copyToClipboard() {
    this.clipboard.copy(this.authorizedUserToken());
    this.isCopied.set(true);
    setTimeout(() => {
      this.isCopied.set(false);
    }, 3000);
  }

  saveFeatureClick(event: { name: FeatureFlagName; active: boolean }) {
    this.saveFeature.emit({ feature: event.name, isActive: event.active });
  }

  changeAccountClick() {
    this.isAccountChange.set(!this.isAccountChange());
  }

  selectAccountClick(account: AccountView) {
    this.changeAccount.emit(account);
    this.changeAccountClick();
  }

  openUserFeatures() {
    this.showFeatures.set(true);
    this.closeMenu();
  }

  openMenu() {
    this.isOpenMenu.set(!this.isOpenMenu());
    this.accountClick.emit();
  }

  closeMenu() {
    this.isOpenMenu.set(false);
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
