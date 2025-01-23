import { Injectable, inject } from '@angular/core';
import { Undefined } from '../../app.types';
import { SharedLocalStorageService } from '../../shared/services/local-storage.service';
import { Account } from './account.types';

const ACCOUNT_ID_KEY = 'account_id';
@Injectable({ providedIn: 'root' })
export class CurrentAccountProvider {
  private readonly storage = inject(SharedLocalStorageService);

  getActiveAccountId(): number | Undefined {
    const storageValue = this.storage.getItem(ACCOUNT_ID_KEY);
    return isFinite(Number(storageValue)) ? Number(storageValue) : null;
  }

  setActiveAccountId(currentAccount: Account) {
    this.storage.setItem(ACCOUNT_ID_KEY, String(currentAccount.id));
  }
}
