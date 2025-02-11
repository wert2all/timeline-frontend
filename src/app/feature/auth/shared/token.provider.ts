import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Undefined } from '../../../app.types';

@Injectable({ providedIn: 'root' })
export class TokenProvider {
  private oAuthService = inject(OAuthService);

  getToken(): string | Undefined {
    return this.oAuthService.getIdToken()
      ? btoa(this.oAuthService.getIdToken())
      : null;
  }
}
