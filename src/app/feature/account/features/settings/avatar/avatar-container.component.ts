import { Component, input, output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Undefined } from '../../../../../app.types';

@Component({
  standalone: true,
  selector: 'app-settings-avatar-container',
  templateUrl: './avatar-container.component.html',
  imports: [NgIconComponent],
})
export class SettingsAvatarContainerComponent {
  avatar = input.required<string | Undefined>();
  title = input<string>();

  remove = output();
  changeAvatar = output();
}
