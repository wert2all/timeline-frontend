import { Component, input, output } from '@angular/core';
import { CurrentAccountView } from '../../../layout/header/header.types';

@Component({
  standalone: true,
  selector: 'app-top-menu-current-account',
  templateUrl: './current-account.component.html',
})
export class CurrentAccountComponent {
  account = input.required<CurrentAccountView>();
  isOpenMenu = input(false);

  openMenu = output();
}
