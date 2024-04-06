export type MessageType = 'success' | 'error' | 'warning';

export type NotificationMessage = {
  uuid: string;
  read: boolean;
  content: { message: string; title?: string };
  type: MessageType;
  duration?: number;
};

export type NotificationsState = {
  messages: NotificationMessage[];
};
