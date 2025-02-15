import { Component, input, output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Undefined } from '../../../../../app.types';
import { SharedLoaderComponent } from '../../../../../shared/content/loader/loader.component';

@Component({
  standalone: true,
  selector: 'app-settings-avatar-container',
  templateUrl: './avatar-container.component.html',
  imports: [NgIconComponent, SharedLoaderComponent],
})
export class SettingsAvatarContainerComponent {
  avatar = input.required<string | Undefined>();
  title = input<string>();
  loading = input<boolean>(false);

  remove = output();
  changeAvatar = output<{ file: File; url: string }>();

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.changeAvatar.emit({
      file: input.files![0],
      url: URL.createObjectURL(input.files![0]),
    });
  }
}
