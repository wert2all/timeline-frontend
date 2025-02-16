import { Component, inject, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLogin1Outline } from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { HeroComponent } from '../../../../shared/content/hero/hero.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  viewProviders: [provideIcons({ saxLogin1Outline })],
  imports: [LayoutComponent, NgIconComponent, HeroComponent],
})
export class LoginPageComponent {
  private readonly store = inject(Store);
  private readonly authService = inject(OAuthService);

  protected isLoading = signal(false);
  protected canUseCookies = this.store.selectSignal(
    sharedFeature.canUseNecessaryCookies
  );

  login() {
    this.isLoading.set(true);
    this.authService.initLoginFlow();
  }
}
