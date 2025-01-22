import { createActionGroup, emptyProps } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Dispatch backend api auth error': emptyProps(),
    'Dispatch empty user profile on init': emptyProps(),
    'Dispatch empty user profile on redirect': emptyProps(),
    'Dispatch empty previewly token error': emptyProps(),
  },
});
