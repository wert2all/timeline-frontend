import { Component, computed, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxInformationOutline,
  saxLoginOutline,
} from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { map, of } from 'rxjs';
import { ApiClient } from '../../../../api/internal/graphql';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../libs/api.functions';
import { HeroComponent } from '../../../../shared/content/hero/hero.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { NewAuthService } from '../../../auth/shared/auth.service';

@Component({
  standalone: true,
  selector: 'app-redirect',
  templateUrl: './redirect-page.component.html',
  imports: [LayoutComponent, HeroComponent, NgIconComponent],
  viewProviders: [provideIcons({ saxInformationOutline, saxLoginOutline })],
})
export class LoginRedirectPageComponent {
  private readonly authService = inject(NewAuthService);
  private readonly api = inject(ApiClient);
  private readonly store = inject(Store);

  private readonly isAuthenticated = toSignal(
    of(this.authService.hasValidToken())
  );

  private readonly apiAuth = rxResource({
    request: this.isAuthenticated,
    loader: ({ request }) => {
      if (request) {
        return this.api
          .authorize()
          .pipe(
            map(result =>
              apiAssertNotNull(
                extractApiData(result)?.profile?.accounts,
                'Could not authorize'
              )
            )
          );
      }
      throw new Error('Not authenticated');
    },
  });

  protected readonly error = computed(() => this.apiAuth.error());
  protected readonly accounts = computed(() =>
    this.apiAuth.value()?.filter(account => !!account)
  );

  constructor() {
    effect(() => {
      const accounts = this.accounts();
      if (accounts) {
        this.store.dispatch(SharedActions.successAuthenticated({ accounts }));
      }
    });
  }

  login() {
    this.authService.login();
  }
}
