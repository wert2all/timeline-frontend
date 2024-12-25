import { createActionGroup, emptyProps } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Dispatch api authorize on redirect': emptyProps(),
    'Dispatch logout': emptyProps(),

    'Dispatch backend api auth error': emptyProps(),
    'Dispatch empty user profile on init': emptyProps(),
    'Dispatch empty user profile on redirect': emptyProps(),
    'Dispatch empty previewly token error': emptyProps(),

    'After logout': emptyProps(),
  },
});
