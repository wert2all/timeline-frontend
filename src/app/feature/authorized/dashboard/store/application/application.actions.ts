import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ModalWindowType } from './application.types';

export const ApplicationActions = createActionGroup({
  source: 'Application',
  events: {
    'Opens modal window': props<{ windowType: ModalWindowType }>(),
    'Close modal window': emptyProps(),
  },
});
