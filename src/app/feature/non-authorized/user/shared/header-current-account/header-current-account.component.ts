import { Component, input, output } from '@angular/core';
import { CurrentAccountView } from '../../../../ui/layout/header/header.types';

@Component({
  standalone: true,
  selector: 'app-header-current-account',
  templateUrl: './header-current-account.component.html',
})
export class HeaderCurrentAccountComponent {
  account = input.required<CurrentAccountView>();
  isOpenMenu = input(false);

  openMenu = output();
}
