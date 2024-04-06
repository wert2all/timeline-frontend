export type MessageType = 'success' | 'error' | 'warning';

export type NotificationMessage = {
  uuid: string;
  read: boolean;
  message: string;
  type: MessageType;
};

export type NotificationsState = {
  messages: NotificationMessage[];
};
