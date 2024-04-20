import { Component, inject } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { NoAuthorizedLayoutComponent } from '../../../layout/no-authorized/no-authorized-layout.component';
import { authFeature } from '../../../store/auth/auth.reducer';
import { LoginContainerComponent } from './widgets/login/login-container.component';
@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [
    NoAuthorizedLayoutComponent,
    NgIconComponent,
    LoginContainerComponent,
    AsyncPipe,
  ],
})
export class LoginPageComponent {
  isAuthorised = inject(Store).select(authFeature.isAuthorized);

  constructor(router: Router) {
    this.isAuthorised
      .pipe(
        takeUntilDestroyed(),
        filter(isAuth => isAuth)
      )
      .subscribe(() => {
        router.navigate(['/']);
      });
  }
}
