import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../../../../shared/content/modal/modal.component';

@Component({
  selector: 'app-modal-confirm',
  standalone: true,
  templateUrl: './modal-confirm.component.html',
  imports: [CommonModule, ModalComponent],
})
export class ModalConfirmComponent {
  show = input.required<boolean>();
  confirmMessage = input.required<string>();

  dismissAction = output();
  confirmAction = output();
}
