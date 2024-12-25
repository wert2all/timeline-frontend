import { createActionGroup, emptyProps } from '@ngrx/store';

export const NavigationActions = createActionGroup({
  source: 'Navigation',
  events: {
    'To login': emptyProps(),
    'To user dashboard': emptyProps(),

    'After to login': emptyProps(),
    'After to user dashboard': emptyProps(),
  },
});
