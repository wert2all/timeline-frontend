import { Component, input, output } from '@angular/core';
import { LoadingButtonComponent } from '../../layout/content/loading-button/loading-button.component';

@Component({
  standalone: true,
  imports: [LoadingButtonComponent],
  selector: 'app-shared-form-controls',
  templateUrl: './controls.component.html',
})
export class FormControlsComponent {
  acceptButtonTitle = input<string>('accept');
  dismissButtonTitle = input<string>('dismiss');

  acceptButtonIcon = input<string | null>(null);

  isDisabled = input<boolean>(true);
  isLoading = input<boolean>(false);

  acceptAction = output();
  dismissAction = output();
}
