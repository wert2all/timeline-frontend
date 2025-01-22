import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../../services/auth.service';
import { HeroComponent } from '../../../../../shared/content/hero/hero.component';
import { LayoutComponent } from '../../../../../shared/layout/layout.component';
import { AuthActions } from '../../../../../store/auth/auth.actions';

@Component({
  standalone: true,
  selector: 'app-redirect',
  templateUrl: './redirect-page.component.html',
  imports: [LayoutComponent, HeroComponent],
})
export class LoginRedirectPageComponent {
  private store = inject(Store);
  private onAuth = inject(AuthService).onAuth;

  constructor() {
    effect(() => {
      if (this.onAuth()) {
        this.store.dispatch(AuthActions.dispatchApiAuthorizeOnRedirect());
      }
    });
  }
}
