import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import {
  CredentialResponse,
  GoogleUserInfo,
  IdConfiguration,
} from '../../store/auth/auth.types';

export interface Listeners {
  onSignIn: (token: string, user: GoogleUserInfo) => void;
  onNotDisplayed: () => void;
  onNotVerifiedEmail: () => void;
}
const defaultListeners: Listeners = {
  onSignIn: () => {},
  onNotDisplayed: () => {},
  onNotVerifiedEmail: () => {},
};

@Injectable({
  providedIn: 'root',
})
export class GoogleOuthService {
  private isInitialized: boolean = false;
  private readonly clientId = environment.services.google.clientId;
  private googleConfiguration: IdConfiguration = {
    client_id: this.clientId,
    callback: this.getResponseCallback.bind(this),
    auto_select: true,
    cancel_on_tap_outside: false,
    use_fedcm_for_prompt: true,
  };

  // private onNotification = (
  //   notification: google.accounts.id.PromptMomentNotification
  // ) => {
  //   if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
  //     this.listeners.onNotDisplayed();
  //   }
  // };
  private listeners: Listeners = defaultListeners;

  login(listeners: Listeners) {
    document
      .hasStorageAccess()
      .then(hasAccess => {
        if (!hasAccess) {
          console.log('no access - requesting access');
          document.requestStorageAccess();
        }
      })
      .then(() => {
        document.hasStorageAccess().then(hasAccess => {
          console.log('hasAccess:', hasAccess);
          this.initialize(listeners);
          google.accounts.id.prompt();
        });
      })
      .catch(err => {
        console.log('hasStorageAccess() failed', err);
      });
  }
  private initialize(listeners: Listeners) {
    if (!this.isInitialized) {
      google.accounts.id.initialize(this.googleConfiguration);
      this.isInitialized = true;
    }
    this.listeners = listeners;
  }

  private getResponseCallback(response: CredentialResponse) {
    const userInfo = jwtDecode(response.credential) as GoogleUserInfo;
    if (userInfo.email_verified) {
      this.listeners.onSignIn(response.credential, userInfo);
    } else {
      this.listeners.onNotVerifiedEmail();
    }
  }
}
