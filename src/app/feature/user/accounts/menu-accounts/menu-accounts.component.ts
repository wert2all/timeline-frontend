import { Component, input, output, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxArrowLeftOutline,
  saxArrowRightOutline,
} from '@ng-icons/iconsax/outline';
import { Unique } from '../../../../app.types';
import { MenuAccountComponent } from '../menu-account/menu-account.component';

export type AccountView = Unique & {
  name: string;
  firstLetter: string;
  avatar?: string;
};
@Component({
  selector: 'app-menu-accounts',
  standalone: true,
  templateUrl: './menu-accounts.component.html',
  imports: [MenuAccountsComponent, NgIconComponent, MenuAccountComponent],
  viewProviders: [provideIcons({ saxArrowLeftOutline, saxArrowRightOutline })],
})
export class MenuAccountsComponent {
  currentAccount = input.required<AccountView | null>();
  accounts = input<AccountView[]>([]);
  isAccountChange = signal(false);
  selectAccount = output<Unique>();

  changeAccountClick() {
    this.isAccountChange.set(!this.isAccountChange());
  }

  selectAccountClick(account: AccountView) {
    this.selectAccount.emit(account);
    this.changeAccountClick();
  }
}
