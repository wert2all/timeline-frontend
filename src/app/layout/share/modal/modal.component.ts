import {
  Component,
  ElementRef,
  ViewChild,
  effect,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  standalone: true,
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @ViewChild('modal') private modal: ElementRef<HTMLDialogElement> | null =
    null;

  show = input.required<boolean>();
  title = input<string>();
  onClosed = output<boolean>();

  constructor() {
    effect(() => {
      if (this.show()) {
        this.modal?.nativeElement.showModal();
      } else {
        this.modal?.nativeElement.close();
      }
    });
  }
}
