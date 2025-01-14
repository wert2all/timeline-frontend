export type MessageType = 'success' | 'error' | 'warning';

export interface NotificationMessage {
  uuid: string;
  read: boolean;
  message: string;
  type: MessageType;
}

export interface NotificationsState {
  messages: NotificationMessage[];
}
