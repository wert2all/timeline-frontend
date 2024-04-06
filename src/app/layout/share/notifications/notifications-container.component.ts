import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
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
  markRead = output<NotificationMessage>();
  messages = signal<NotificationMessage[]>([
    {
      uuid: '1',
      read: false,
      type: 'success',
      content: { message: 'Test message' },
    },
    {
      uuid: '2',
      read: false,
      type: 'error',
      content: { message: 'Test message #2' },
    },
    {
      uuid: '3',
      read: false,
      type: 'warning',
      content: { message: 'Test message #3' },
    },
  ]);

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
    this.markRead.emit(message);
  }
}
