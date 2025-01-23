import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClient } from '../../../api/internal/graphql';
import { Undefined } from '../../../app.types';
import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { Account, AccountsProvigerInterface } from '../account.types';

@Injectable({ providedIn: 'root' })
export class AccountsProvider implements AccountsProvigerInterface {
  private readonly api = inject(ApiClient);

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
      )
    );
  }

  getAccount(accountId: number): Observable<Account | Undefined> {
    return this.getAccounts().pipe(
      map(accounts => accounts.find(account => account?.id === accountId))
    );
  }
}
