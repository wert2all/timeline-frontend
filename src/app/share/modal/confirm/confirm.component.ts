import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-confirm',
  standalone: true,
  templateUrl: './confirm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ModalComponent],
})
export class ConfirmComponent {
  show = input.required<boolean>();
  confirmMessage = input.required<string>();

  dismissAction = output();
  confirmAction = output();
}
