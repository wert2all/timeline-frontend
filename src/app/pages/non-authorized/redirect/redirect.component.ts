import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../services/auth.service';
import { HeroComponent } from '../../../share/hero/hero.component';
import { LayoutComponent } from '../../../share/layout/layout.component';
import { AuthActions } from '../../../store/auth/auth.actions';

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
    //todo redirect to user dashboard if user is logged in
    effect(() => {
      if (this.onAuth()) {
        this.store.dispatch(AuthActions.dispatchApiAuthorizeOnRedirect());
      }
      //todo after timeout show error message and redirect to login page
    });
  }
}
