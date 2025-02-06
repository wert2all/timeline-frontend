import { Component, computed, input, output } from '@angular/core';
import { AccountView } from '../../account.types';

@Component({
  standalone: true,
  selector: 'app-shared-account-view',
  templateUrl: './account-view.component.html',
  styleUrl: './account-view.component.scss',
})
export class SharedAccountViewComponent {
  account = input.required<AccountView>();
  isSelected = input(false);

  accountClick = output();

  protected avatar = computed(() => {
    const avatar = this.account().avatar;
    return avatar ? 'url(' + avatar + ') no-repeat center' : '';
  });
}
