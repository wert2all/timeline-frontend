import { Injectable, inject, signal } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Undefined } from '../../app.types';
import { AuthProcess, TokenProvider } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthFacade implements TokenProvider, AuthProcess {
  private oAuthService = inject(OAuthService);
  private authConfig = inject(AuthConfig);

  private _onAuth = signal(false);
  private _onError = signal<Error | null>(null);

  constructor() {
    this.oAuthService.configure(this.authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    // eslint-disable-next-line sonarjs/no-async-constructor
    this.oAuthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(result => this._onAuth.set(result))
      .catch(e => this._onError.set(e));
  }

  getToken(): string | Undefined {
    return this.oAuthService.getIdToken()
      ? btoa(this.oAuthService.getIdToken())
      : null;
  }

  public get onAuth() {
    return this._onAuth;
  }

  public get onError() {
    return this._onError;
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout().finally(() => {
      this.oAuthService.logOut();
    });
  }
}
