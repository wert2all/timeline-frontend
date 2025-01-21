import { makeEnvironmentProviders } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const provideAuthConfig = () =>
  makeEnvironmentProviders([
    {
      provide: AuthConfig,
      useValue: {
        // Url of the Identity Provider
        issuer: 'https://accounts.google.com',

        // URL of the SPA to redirect the user to after login
        redirectUri: window.location.origin + '/user/redirect',

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
      },
    },
  ]);
