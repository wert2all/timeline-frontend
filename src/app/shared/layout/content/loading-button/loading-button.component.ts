import { Component, computed, input, output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  standalone: true,
  selector: 'app-content-loading-button',
  imports: [NgIconComponent],
  templateUrl: './loading-button.component.html',
})
export class LoadingButtonComponent {
  isLoading = input.required<boolean>();

  isDisabled = input<boolean>(false);
  icon = input<string | null>(null);
  style = input<string>('primary');

  clickEvent = output();

  protected shouldDisable = computed(
    () => this.isDisabled() || this.isLoading()
  );
}
