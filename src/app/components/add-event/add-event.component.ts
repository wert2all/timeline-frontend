import { Component, signal, AfterViewInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxAddOutline } from '@ng-icons/iconsax/outline';
import { ModalComponent } from '../../layout/share/modal/modal.component';

@Component({
  selector: 'app-add-event',
  standalone: true,
  templateUrl: './add-event.component.html',
  providers: [provideIcons({ saxAddOutline })],
  imports: [NgIconComponent, ModalComponent],
})
export class AddEventComponent implements AfterViewInit {
  shouldShow = signal<number>(0);
  title = signal<string>('Add event');
  showModal() {
    this.resetForm();
    this.shouldShow.set(window.performance.now());
  }
  closeForm() {
    this.shouldShow.set(0);
  }
  onClosed() {
    console.log('closed');
  }

  ngAfterViewInit(): void {
    this.showModal();
  }

  private resetForm() {
    this.title.set('Add new event: set date and time');
  }
}
