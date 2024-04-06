import { InjectionToken, inject } from '@angular/core';
import { AuthTokenStorageService } from './auth-token-storage.service';
import { AuthState } from './auth.types';

export const AuthInitialState = new InjectionToken<AuthState>('AuthState', {
  factory: () => ({
    token: inject(AuthTokenStorageService).getToken(),
    loading: false,
    authorizedUser: null,
  }),
});
