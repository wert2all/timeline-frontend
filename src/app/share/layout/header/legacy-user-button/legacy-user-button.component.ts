import { Component, inject, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { authFeature } from '../../../../store/auth/auth.reducer';

@Component({
  standalone: true,
  selector: 'app-legacy-user-button',
  templateUrl: './legacy-user-button.component.html',
})
export class LegacyUserButtonComponent {
  onGoToDashboard = output<void>();
  private readonly store = inject(Store);

  protected readonly isLoading = this.store.selectSignal(authFeature.isLoading);
  protected readonly authorizedUser = this.store.selectSignal(
    authFeature.selectAuthorizedUser
  );
}
