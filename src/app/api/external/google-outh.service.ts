import { inject, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

export interface OauthUserInfo {
  info: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
}
export interface Listeners {
  onSignIn: (token: string, user: OauthUserInfo) => void;
  onError: (error: string) => void;
}

@Injectable({
  providedIn: 'root',
})
export class GoogleOuthService {
  private readonly oAuthService = inject(OAuthService);
  constructor() {
    this.oAuthService.configure(environment.services.oAuth);
    // manually configure a logout url, because googles discovery document does not provide it
    this.oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';
  }

  login(listeners: Listeners) {
    // loading the discovery document from google, which contains all relevant URL for
    // the OAuth flow, e.g. login url
    this.oAuthService.loadDiscoveryDocument().then(() => {
      // // This method just tries to parse the token(s) within the url when
      // // the auth-server redirects the user back to the web-app
      // // It doesn't send the user the the login page
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        // when not logged in, redirecvt to google for login
        // else load user profile
        debugger;
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService.loadUserProfile().then(userProfile => {
            listeners.onSignIn(
              this.oAuthService.getAccessToken(),
              userProfile as OauthUserInfo
            );
          });
        }
      });
    });
  }

  isAuthorized() {
    this.oAuthService.loadDiscoveryDocument().then(() => {
      // // This method just tries to parse the token(s) within the url when
      // // the auth-server redirects the user back to the web-app
      // // It doesn't send the user the the login page
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        // when not logged in, redirecvt to google for login
        // else load user profile
        if (!this.oAuthService.hasValidAccessToken()) {
          console.log('should log in');
        } else {
          this.oAuthService.loadUserProfile().then(userProfile => {
            debugger;
            console.log(userProfile);
          });
        }
      });
    });
    return this.oAuthService.hasValidAccessToken();
  }
}
