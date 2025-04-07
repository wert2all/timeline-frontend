import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ModalWindowType } from './modal-window.types';

export const ModalWindowActions = createActionGroup({
  source: 'Modal',
  events: {
    'Open modal window': props<{ windowType: ModalWindowType }>(),
    'Close modal window': emptyProps(),
  },
});
