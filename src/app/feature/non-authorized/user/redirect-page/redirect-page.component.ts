import { Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HeroComponent } from '../../../../shared/content/hero/hero.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { AuthService } from '../../../../store/auth/auth.service';
import { CurrentAccountService } from '../shared/current-account.service';

@Component({
  standalone: true,
  selector: 'app-redirect',
  templateUrl: './redirect-page.component.html',
  imports: [LayoutComponent, HeroComponent],
})
export class LoginRedirectPageComponent {
  private readonly store = inject(Store);
  private readonly onAuth = inject(AuthService).onAuth;
  private readonly currentAccount = inject(CurrentAccountService);
  private readonly resource = rxResource({
    request: this.onAuth,
    loader: params => (params ? this.currentAccount.getAccount() : of(null)),
  });

  constructor() {
    effect(() => {
      const currentAccount = this.resource.value();
      if (currentAccount) {
        this.store.dispatch(
          SharedActions.setActiveAccountOnRedirect({ account: currentAccount })
        );
      }
    });
  }
}
