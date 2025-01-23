import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Undefined } from '../../app.types';
import { SharedAuthTokenService } from '../../shared/services/auth-token.service';
import { SharedLocalStorageService } from '../../shared/services/local-storage.service';
import { SharedActions } from '../../shared/store/shared/shared.actions';
import {
  Account,
  LocalStorageAccount,
  asLocalStorageAccount,
} from './auth.types';

const ACTIVE_ACCOUNT_KEY = 'active-account';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenService = inject(SharedAuthTokenService);
  private readonly localStorage = inject(SharedLocalStorageService);
  private readonly store = inject(Store);

  trySetActiveAccount(): void {
    if (this.tokenService.token) {
      const accountFromStorage = this.extractAccountFromStorage();
      if (accountFromStorage) {
        const account = this.convertToAccount(accountFromStorage);
        if (account) {
          this.store.dispatch(SharedActions.setActiveAccount({ account }));
        }
      }
    }
  }

  private extractAccountFromStorage(): LocalStorageAccount | Undefined {
    const storageAccount = this.localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    return storageAccount
      ? asLocalStorageAccount(JSON.parse(storageAccount))
      : null;
  }

  private convertToAccount(
    accountFromStorage: LocalStorageAccount
  ): Account | Undefined {
    const accountId = Number(accountFromStorage.id);
    if (accountId && isFinite(accountId)) {
      return {
        ...accountFromStorage,
        id: accountId,
      };
    }
    return null;
  }
}
