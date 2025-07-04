import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorInfo, phosphorSignIn } from '@ng-icons/phosphor-icons/regular';
import { Store } from '@ngrx/store';
import { HeroComponent } from '../../../../shared/content/hero/hero.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { defaultAccountName } from '../../../account/account.functions';
import { AccountsService } from '../../../account/share/accounts.service';
import { NewAuthService } from '../../../auth/shared/auth.service';

@Component({
  standalone: true,
  selector: 'app-redirect',
  templateUrl: './redirect-page.component.html',
  imports: [LayoutComponent, HeroComponent, NgIconComponent],
  viewProviders: [provideIcons({ phosphorInfo, phosphorSignIn })],
})
export class LoginRedirectPageComponent {
  private readonly authService = inject(NewAuthService);
  private readonly store = inject(Store);
  private readonly accountsProvider = inject(AccountsService);

  private readonly isAuthenticated = signal(this.authService.hasValidToken());
  private readonly apiAuth = rxResource({
    params: this.isAuthenticated,
    stream: ({ params }) => {
      if (params) {
        return this.accountsProvider.getAccounts();
      }
      throw new Error('Not authenticated');
    },
  });

  protected readonly error = computed(() => this.apiAuth.error());
  protected readonly accounts = computed(() =>
    this.apiAuth.value()?.map(account => ({
      ...account,
      name: account.name || defaultAccountName,
      about: account.about || '',
    }))
  );

  constructor() {
    effect(() => {
      const accounts = this.accounts();
      if (accounts) {
        this.store.dispatch(
          SharedActions.successAuthenticated({
            accounts,
            redirect: this.authService.redirectUrl(),
          })
        );
      }
    });
  }

  login() {
    this.authService.login();
  }
}
