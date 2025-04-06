import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { phosphorSignIn } from '@ng-icons/phosphor-icons/regular';
import { Store } from '@ngrx/store';
import { HeroComponent } from '../../../../shared/content/hero/hero.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { SharedAuthButtonComponent } from '../../../account/share/auth-button/auth-button.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  viewProviders: [provideIcons({ phosphorSignIn })],
  imports: [LayoutComponent, HeroComponent, SharedAuthButtonComponent],
})
export class LoginPageComponent {
  private readonly store = inject(Store);

  protected canUseCookies = this.store.selectSignal(
    sharedFeature.canUseNecessaryCookies
  );
}
