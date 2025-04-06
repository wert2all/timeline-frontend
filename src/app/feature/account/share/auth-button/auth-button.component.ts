import { Component, inject, signal } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';

@Component({
  standalone: true,
  selector: 'app-shared-auth-button',
  templateUrl: './auth-button.component.html',
  imports: [NgIconComponent],
})
export class SharedAuthButtonComponent {
  private readonly store = inject(Store);
  private readonly authService = inject(OAuthService);

  protected isLoading = signal(false);
  protected canUseCookies = this.store.selectSignal(
    sharedFeature.canUseNecessaryCookies
  );

  protected login() {
    this.isLoading.set(true);
    this.authService.initLoginFlow();
  }
}
