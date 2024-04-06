import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxLoginOutline } from '@ng-icons/iconsax/outline';
import { AuthStore } from '../../../store/auth/auth.store';

@Component({
  selector: 'app-auth-control-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './auth-control-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxLoginOutline })],
})
export class AuthControlButtonComponent {
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  isLoading = this.store.isLoading;
  authorizedUser = this.store.authorizedUser;

  onClick() {
    if (this.authorizedUser()) {
      //nav to profile
    } else {
      this.router.navigate(['user', 'login']);
    }
  }
}
