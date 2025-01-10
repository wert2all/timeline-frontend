import { Injectable } from '@angular/core';
import { Iterable, Undefined } from '../app.types';

const ACTIVE_ACCOUNT_KEY = 'active-Account';
@Injectable({
  providedIn: 'root',
})
export class ActiveAccountService {
  public get activeAccount(): number | Undefined {
    const accountId = Number(localStorage.getItem(ACTIVE_ACCOUNT_KEY));
    return isFinite(accountId) ? accountId : undefined;
  }

  public set activeAccount(account: Iterable) {
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, account.id.toString());
  }

  public clean() {
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  }
}
