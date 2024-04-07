import { Component, signal } from '@angular/core';
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
export class AddEventComponent {
  shouldShow = signal<number>(0);

  showModal() {
    this.shouldShow.set(window.performance.now());
  }

  onClosed() {
    console.log('closed');
  }
}
