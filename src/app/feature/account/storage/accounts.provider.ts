import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map, tap } from 'rxjs';
import { ApiClient } from '../../../api/internal/graphql';
import { Undefined } from '../../../app.types';
import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { Account, AccountsProvigerInterface } from '../account.types';
import { AccountActions } from '../store/account.actions';

@Injectable({ providedIn: 'root' })
export class AccountsProvider implements AccountsProvigerInterface {
  private readonly api = inject(ApiClient);
  private readonly store = inject(Store);

  getAccounts(): Observable<Account[]> {
    return this.api.authorize().pipe(
      map(result =>
        apiAssertNotNull(
          extractApiData(result)?.profile?.accounts,
          'Could not authorize'
        )
          .map(account =>
            account
              ? {
                  id: account.id,
                  name: account.name ? account.name : undefined,
                  previewlyToken: account.previewlyToken,
                  settings: account.settings.reduce(
                    (acc, v) => ({ ...acc, [v.key]: v.value }),
                    {}
                  ),
                }
              : null
          )
          .filter(account => !!account)
      ),
      tap(accounts =>
        this.store.dispatch(AccountActions.setUserAccounts({ accounts }))
      )
    );
  }

  getAccount(accountId: number): Observable<Account | Undefined> {
    return this.getAccounts().pipe(
      map(accounts => accounts.find(account => account?.id === accountId))
    );
  }
}
