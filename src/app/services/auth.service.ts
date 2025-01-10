import { Injectable, inject, signal } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private oAuthService = inject(OAuthService);
  private authConfig = inject(AuthConfig);
  private _onAuth = signal(false);

  public get idToken(): string | null {
    return this.oAuthService.getIdToken();
  }

  public get onAuth() {
    return this._onAuth;
  }
  constructor() {
    this.oAuthService.configure(this.authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(result => this._onAuth.set(result))
      .catch(e => console.log('auth error: ', e));
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
  }

  getProfile = () => this.oAuthService.getIdentityClaims();
}
