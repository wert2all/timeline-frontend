import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NotificationMessage } from '../../store/notification/notifications.types';

@Component({
  selector: 'app-notifications-container',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./notifications-container.component.scss'],
  templateUrl: './notifications-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsContainerComponent {
  messages = input.required<NotificationMessage[]>();
  markRead = output<NotificationMessage>();
}
