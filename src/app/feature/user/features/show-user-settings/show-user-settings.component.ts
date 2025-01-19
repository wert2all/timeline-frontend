import { Component, input, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-show-user-settings',
  templateUrl: './show-user-settings.component.html',
})
export class ShowUserSettingsComponent {
  showFeatures = input(false);

  close = output();
}
