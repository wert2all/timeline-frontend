import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-shared-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('modal') private modal: ElementRef<HTMLDialogElement> | null =
    null;

  show = input.required<boolean>();
  title = input<string>();
  closed = output<boolean>();

  constructor() {
    effect(() => {
      if (this.show()) {
        this.modal?.nativeElement.showModal();
      } else {
        this.modal?.nativeElement.close();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.show()) {
      this.modal?.nativeElement.showModal();
    } else {
      this.modal?.nativeElement.close();
    }

    this.modal?.nativeElement.addEventListener('close', () => {
      this.closed.emit(true);
    });
  }
}
