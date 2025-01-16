import { Component, input, output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  standalone: true,
  selector: 'app-loading-button',
  imports: [NgIconComponent],
  templateUrl: './loading-button.component.html',
})
export class LoadingButtonComponent {
  isLoading = input.required<boolean>();
  icon = input<string | null>(null);
  style = input<string>('primary');

  clickEvent = output();
}
