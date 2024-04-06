import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLogin1Outline } from '@ng-icons/iconsax/outline';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../../../environments/environment';
import { AuthStore } from '../../../../../store/auth/auth.store';
import {
  CredentialResponse,
  GoogleUserInfo,
  IdConfiguration,
} from '../../../../../store/auth/auth.types';

@Component({
  selector: 'app-login-container',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './login-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxLogin1Outline })],
})
export class LoginContainerComponent {
  private readonly authStore = inject(AuthStore);

  private readonly clientId = environment.googleClientId;
  private readonly googleConfiguration: IdConfiguration = {
    client_id: this.clientId,
    callback: this.getResponseCallback.bind(this),
    auto_select: true,
    cancel_on_tap_outside: false,
  };

  isLoading = this.authStore.isLoading;

  constructor() {
    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize(this.googleConfiguration);
    };
  }

  login() {
    this.authStore.setLoading(true);
    google.accounts.id.prompt();
  }

  private getResponseCallback(response: CredentialResponse) {
    const userInfo = jwtDecode(response.credential) as GoogleUserInfo;
    if (userInfo.email_verified) {
      this.authStore.setToken(response.credential);
    } else {
      throw 'User email is not verified';
    }
  }
}
