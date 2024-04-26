import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.actions';
import { authFeature } from '../../../store/auth/auth.reducer';
import { AuthControlButtonComponent } from './auth-control-button/auth-control-button.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  templateUrl: './top-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AuthControlButtonComponent, LogoutButtonComponent],
})
export class TopMenuComponent {
  private readonly store = inject(Store);

  isLoading = this.store.selectSignal(authFeature.isLoading);
  isAuthorized = this.store.selectSignal(authFeature.isAuthorized);

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
