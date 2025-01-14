import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../services/auth.service';
import { HeroComponent } from '../../../share/hero/hero.component';
import { LayoutComponent } from '../../../share/layout/layout.component';
import { AuthActions } from '../../../store/auth/auth.actions';
import { NavigationActions } from '../../../store/navigation/navigation.actions';

@Component({
  standalone: true,
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  imports: [LayoutComponent, HeroComponent],
})
export class LoginRedirectPageComponent {
  private store = inject(Store);
  private onAuth = inject(AuthService).onAuth;

  constructor() {
    effect(() => {
      this.store.dispatch(
        this.onAuth()
          ? AuthActions.dispatchApiAuthorizeOnRedirect()
          : NavigationActions.toLogin()
      );
    });
  }
}
