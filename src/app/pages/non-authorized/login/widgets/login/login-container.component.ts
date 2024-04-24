import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLogin1Outline } from '@ng-icons/iconsax/outline';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../../../environments/environment';

import { Store } from '@ngrx/store';
import { AuthActions } from '../../../../../store/auth/auth.actions';
import { authFeature } from '../../../../../store/auth/auth.reducer';
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
export class LoginContainerComponent implements OnInit {
  private readonly store = inject(Store);

  private readonly clientId = environment.googleClientId;
  private readonly googleConfiguration: IdConfiguration = {
    client_id: this.clientId,
    callback: this.getResponseCallback.bind(this),
    auto_select: true,
    cancel_on_tap_outside: false,
  };

  isLoading = this.store.select(authFeature.isLoading);

  ngOnInit(): void {
    // window.onGoogleLibraryLoad = () => {
    console.log(this.googleConfiguration);
    google.accounts.id.initialize(this.googleConfiguration);
    // };
  }

  login() {
    this.store.dispatch(AuthActions.promptLogin());
    google.accounts.id.prompt(prompt => {
      if (prompt.isNotDisplayed()) {
        this.store.dispatch(
          AuthActions.promptNotDisplayed({
            reason: prompt.getNotDisplayedReason(),
          })
        );
      }
    });
  }

  private getResponseCallback(response: CredentialResponse) {
    const userInfo = jwtDecode(response.credential) as GoogleUserInfo;
    if (userInfo.email_verified) {
      this.store.dispatch(
        AuthActions.setTokenAndProfile({
          token: response.credential,
          profile: userInfo,
        })
      );
    } else {
      this.store.dispatch(AuthActions.userEmailIsNotVerified());
    }
  }
}
