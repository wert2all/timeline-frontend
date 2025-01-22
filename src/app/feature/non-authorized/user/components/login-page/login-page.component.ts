import { Component, inject, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLogin1Outline } from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { HeroComponent } from '../../../../../shared/content/hero/hero.component';
import { LayoutComponent } from '../../../../../shared/layout/layout.component';
import { sharedFeature } from '../../../../../shared/store/shared.reducers';
import { accountFeature } from '../../../../../store/account/account.reducer';
import { AuthService } from '../../../../../store/auth/auth.service';
import { NavigationActions } from '../../../../../store/navigation/navigation.actions';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  viewProviders: [provideIcons({ saxLogin1Outline })],
  imports: [LayoutComponent, NgIconComponent, HeroComponent],
})
export class LoginPageComponent {
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private onAuthorize = this.store
    .select(accountFeature.isAuthorized)
    .pipe(filter(isAuth => isAuth));

  protected isLoading = signal(false);
  protected canUseCookies = this.store.selectSignal(
    sharedFeature.canUseNecessaryCookies
  );

  constructor() {
    this.onAuthorize.subscribe(() =>
      this.store.dispatch(NavigationActions.toUserDashboard())
    );
  }

  login() {
    this.isLoading.set(true);
    this.authService.login();
  }
}
