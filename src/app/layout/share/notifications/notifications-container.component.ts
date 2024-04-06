import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationStore } from '../../../store/notifications/notifications.store';
import { NotificationMessage } from '../../../store/notifications/notifications.types';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./notifications-container.component.scss'],
  templateUrl: './notifications-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsContainerComponent {
  private readonly store = inject(NotificationStore);
  messages = this.store.unRead;

  onItemClick(message: NotificationMessage) {
    this.read(message);
  }

  onClose(message: NotificationMessage) {
    this.read(message);
  }

  onAnimationEnd(message: NotificationMessage) {
    this.read(message);
  }

  private read(message: NotificationMessage) {
    this.store.markRead(message.uuid);
  }
}
