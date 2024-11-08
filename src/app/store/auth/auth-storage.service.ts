import { Injectable } from '@angular/core';
import { Iterable } from '../../app.types';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private readonly tokenKey = 'timeline_auth_token';
  private readonly accountIdKey = 'timeline_auth_account_id';

  getToken() {
    return localStorage.getItem(this.tokenKey) || null;
  }

  getAccountId(): string | null {
    return localStorage.getItem(this.accountIdKey) || null;
  }

  setToken(token: string | null) {
    if (token == null) {
      localStorage.removeItem(this.tokenKey);
    } else {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  setAccount(account: Iterable | null) {
    const accountId = account?.id || null;

    if (accountId == null) {
      localStorage.removeItem(this.tokenKey);
    } else {
      localStorage.setItem(this.accountIdKey, accountId.toString());
    }
  }
}
