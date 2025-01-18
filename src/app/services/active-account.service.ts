import { Injectable, inject } from '@angular/core';
import { Iterable, Undefined } from '../app.types';
import { LocalStorageService } from './local-storage.service';

const ACTIVE_ACCOUNT_KEY = 'active-Account';
@Injectable({
  providedIn: 'root',
})
export class ActiveAccountService {
  private readonly localStorage = inject(LocalStorageService);
  public get activeAccount(): number | Undefined {
    const accountId = Number(this.localStorage.getItem(ACTIVE_ACCOUNT_KEY));
    return isFinite(accountId) ? accountId : undefined;
  }

  public set activeAccount(account: Iterable) {
    this.localStorage.setItem(ACTIVE_ACCOUNT_KEY, account.id.toString());
  }

  public clean() {
    this.localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  }
}
