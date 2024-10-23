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
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements AfterViewInit {
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
  ngAfterViewInit(): void {
    this.modal?.nativeElement.addEventListener('close', () => {
      this.onClosed.emit(true);
    });
  }
}
