import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { accountFeature } from '../feature/account/store/account.reducer';
import { UserAccountsKey } from '../feature/account/store/account.types';
import { imagesFeature } from '../shared/store/images/images.reducer';
import { ImagesKey } from '../shared/store/images/images.types';

export const metaReducers = [
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  (reducer: ActionReducer<any, any>) =>
    localStorageSync({
      keys: [
        { [imagesFeature.name]: [ImagesKey] },
        { [accountFeature.name]: [UserAccountsKey] },
      ],
      rehydrate: true,
    })(reducer),
];
