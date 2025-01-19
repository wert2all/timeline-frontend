import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';
import { ModalWindowType } from './application.types';

export const ApplicationActions = createActionGroup({
  source: 'Application',
  events: {
    'Dispatch cookie consent': props<{ cookie: CookieValue }>(),

    'Opens modal window': props<{ windowType: ModalWindowType }>(),
    'Close modal window': emptyProps(),
  },
});
