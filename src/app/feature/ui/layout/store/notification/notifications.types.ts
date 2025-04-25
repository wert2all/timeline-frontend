import { MessageType } from '../../../../../shared/handlers/error.types';

export interface NotificationMessage {
  uuid: string;
  read: boolean;
  message: string;
  type: MessageType;
}

export interface NotificationsState {
  messages: NotificationMessage[];
}
