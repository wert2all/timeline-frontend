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
  private readonly clientId = environment.googleClientId;
  private googleConfiguration: IdConfiguration = {
    client_id: this.clientId,
    callback: this.getResponseCallback.bind(this),
    auto_select: true,
    cancel_on_tap_outside: false,
    use_fedcm_for_prompt: true,
  };

  private listeners: Listeners = defaultListeners;

  login(listeners: Listeners) {
    this.initialize(listeners);
    google.accounts.id.prompt(notification => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        this.listeners.onNotDisplayed();
      }
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
