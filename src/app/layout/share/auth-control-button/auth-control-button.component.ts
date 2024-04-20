import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxClipboardTextOutline,
  saxLoginOutline,
} from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { authFeature } from '../../../store/auth/auth.reducer';

@Component({
  selector: 'app-auth-control-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './auth-control-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxLoginOutline, saxClipboardTextOutline })],
})
export class AuthControlButtonComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  isLoading = this.store.select(authFeature.isLoading);
  isAuthorized: boolean = false;
  user = this.store.select(authFeature.selectPotentialUser);
  isOpenedMenu = signal(false);

  constructor() {
    this.store
      .select(authFeature.isAuthorized)
      .pipe(takeUntilDestroyed())
      .subscribe(isAuthorized => {
        this.isAuthorized = isAuthorized;
      });
  }

  onClick() {
    if (this.isAuthorized) {
      this.isOpenedMenu.update(isOpened => !isOpened);
    } else {
      this.router.navigate(['user', 'login']);
    }
  }
}
