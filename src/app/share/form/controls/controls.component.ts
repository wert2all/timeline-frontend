import { Component, input, output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  standalone: true,
  imports: [NgIconComponent],
  selector: 'app-shared-form-controls',
  templateUrl: './controls.component.html',
})
export class FormControlsComponent {
  acceptButtonTitle = input<string>('accept');
  dismissButtonTitle = input<string>('dismiss');

  acceptButtonIcon = input<string | null>(null);

  isDisabled = input<boolean>(false);

  acceptAction = output();
  dismissAction = output();
}
