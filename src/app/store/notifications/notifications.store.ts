import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { v4 as uuid } from 'uuid';
import { MessageType, NotificationsState } from './notifications.types';

const initialState: NotificationsState = { messages: [] };
export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(state => ({
    unRead: computed(() => state.messages().filter(message => !message.read)),
  })),
  withMethods(store => ({
    markRead(uuid: string): void {
      patchState(store, state => ({
        ...state,
        messages: state.messages.map(message => ({
          ...message,
          read: message.uuid === uuid ? true : message.read,
        })),
      }));
    },

    addMessage(message: string, type: MessageType): void {
      patchState(
        store,
        (state): NotificationsState => ({
          ...state,
          messages: [
            ...state.messages,
            {
              uuid: uuid(),
              type: type,
              read: false,
              message: message,
            },
          ],
        })
      );
    },
  }))
);
