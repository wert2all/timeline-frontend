import { Component, input } from '@angular/core';

@Component({
  selector: 'app-current-account',
  standalone: true,
  templateUrl: './current-account.component.html',
})
export class CurrentAccountComponent {
  name = input.required<string>();
  firstLetter = input.required<string>();

  avatar = input<string | null>(null);
}
