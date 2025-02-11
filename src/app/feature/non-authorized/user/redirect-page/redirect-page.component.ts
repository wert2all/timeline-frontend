import { Component } from '@angular/core';
import { HeroComponent } from '../../../../shared/content/hero/hero.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';

@Component({
  standalone: true,
  selector: 'app-redirect',
  templateUrl: './redirect-page.component.html',
  imports: [LayoutComponent, HeroComponent],
})
export class LoginRedirectPageComponent {
  // private readonly store = inject(Store);
  // private readonly onAuth = inject(AuthFacade).onAuth;
  //
  // private readonly accountsProvider = inject(CachedAccountsProvider);
  // private readonly currentAccountIdProvider = inject(CurrentAccountProvider);
  //
  // private readonly resource = rxResource({
  //   request: this.onAuth,
  //   loader: params => (params ? this.accountsProvider.getAccounts() : of(null)),
  // });

  constructor() {
    // effect(() => {
    //   const accounts = this.resource.value();
    //   if (accounts) {
    //     const activeAccountId =
    //       this.currentAccountIdProvider.getActiveAccountId();
    //     const currentAccount =
    //       accounts.find(a => a.id === activeAccountId) ||
    //       accounts.slice(0, 1)[0];
    //
    //     this.currentAccountIdProvider.setActiveAccountId(currentAccount);
    //     this.store.dispatch(
    //       SharedActions.setActiveAccountAndRedirect({ account: currentAccount })
    //     );
    //   }
    // });
  }
}
