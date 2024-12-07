import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ThemeSwitchComponent } from '../../../feature/ui/theme/theme-switch.component';
import { FeatureFlagComponent } from '../../../feature/user/features/feature-flag/feature-flag.component';
import { TopMenuComponent } from '../../../feature/user/top-menu/top-menu.component';
import { AuthStorageService } from '../../../store/auth/auth-storage.service';
import { AuthActions } from '../../../store/auth/auth.actions';
import { authFeature } from '../../../store/auth/auth.reducer';
import { LoginButtonComponent } from './login-button/login-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TopMenuComponent,
    LoginButtonComponent,
    FeatureFlagComponent,
    ThemeSwitchComponent,
  ],
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly authStorage = inject(AuthStorageService);

  isLoading = this.store.selectSignal(authFeature.isLoading);
  isAuthorized = this.store.selectSignal(authFeature.isAuthorized);
  token = this.authStorage.getToken();
  activeAccount = this.store.selectSignal(authFeature.selectActiveAccount);

  login() {
    this.router.navigate(['user', 'login']);
  }

  logout() {
    this.store.dispatch(AuthActions.dispatchLogout());
  }

  goToDashboard() {
    this.router.navigate(['my']);
  }
}
