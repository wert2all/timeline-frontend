import { Component, input } from '@angular/core';

@Component({
  selector: 'app-menu-account',
  standalone: true,
  templateUrl: './menu-account.component.html',
})
export class MenuAccountComponent {
  name = input.required<string>();
  firstLetter = input.required<string>();

  avatar = input<string | null>(null);
}
