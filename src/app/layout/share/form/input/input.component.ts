import { Component, input, output } from '@angular/core';
import { IconType, NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './input.component.html',
})
export class InputComponent {
  icon = input<IconType | null>(null);
  label = input<string>();
  error = input<string | null>(null);

  onIconClick = output();
}
