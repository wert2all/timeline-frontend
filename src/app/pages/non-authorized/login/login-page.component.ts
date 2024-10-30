import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLogin1Outline } from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { HeroComponent } from '../../../share/hero/hero.component';
import { LayoutComponent } from '../../../share/layout/layout.component';
import { AuthActions } from '../../../store/auth/auth.actions';
import { authFeature } from '../../../store/auth/auth.reducer';
import { TableOfContentsActions } from '../../../store/table-of-contents/table-of-contents.actions';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  viewProviders: [provideIcons({ saxLogin1Outline })],
  imports: [LayoutComponent, NgIconComponent, AsyncPipe, HeroComponent],
})
export class LoginPageComponent {
  private readonly store = inject(Store);

  private isAuthorised = this.store.select(authFeature.isAuthorized);
  isLoading = this.store.select(authFeature.isLoading);

  constructor(router: Router) {
    this.store.dispatch(TableOfContentsActions.cleanItems());
    this.isAuthorised
      .pipe(
        takeUntilDestroyed(),
        filter(isAuth => isAuth)
      )
      .subscribe(() => {
        router.navigate(['/my']);
      });
  }

  login() {
    this.store.dispatch(AuthActions.promptLogin());
  }
}
