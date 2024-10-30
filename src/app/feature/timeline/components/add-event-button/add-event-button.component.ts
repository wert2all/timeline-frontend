import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxAddOutline,
  saxArrowRight1Outline,
} from '@ng-icons/iconsax/outline';

@Component({
  selector: 'app-add-event-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './add-event-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxAddOutline, saxArrowRight1Outline })],
})
export class AddEventButtonComponent {
  disabled = input<boolean>(false);
  addEvent = output();
}
