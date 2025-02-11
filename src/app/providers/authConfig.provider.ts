import {
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { AuthConfig, OAuthStorage } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { NewAuthService } from '../feature/auth/shared/auth.service';

export const provideAuthConfig = () =>
  makeEnvironmentProviders([
    provideAppInitializer((authService = inject(NewAuthService)) =>
      authService.runInitialLoginSequence()
    ),
    {
      provide: AuthConfig,
      useValue: {
        // Url of the Identity Provider
        issuer: 'https://accounts.google.com',

        // URL of the SPA to redirect the user to after login
        redirectUri: window.location.origin + '/user/redirect',
        silentRefreshRedirectUri:
          window.location.origin + '/silent-refresh.html',

        // URL of the SPA to redirect the user after silent refresh
        // silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
        // The SPA's id. The SPA is registerd with this id at the auth-server
        clientId: environment.services.google.clientId,
        strictDiscoveryDocumentValidation: false,
        // set the scope for the permissions the client should request
        // The first three are defined by OIDC. The 4th is a usecase-specific one
        scope: 'openid profile email',
        showDebugInformation: false,
        sessionChecksEnabled: true,
        useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
        clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
      },
    },
    {
      provide: OAuthStorage,
      useFactory: () => localStorage,
    },
  ]);
