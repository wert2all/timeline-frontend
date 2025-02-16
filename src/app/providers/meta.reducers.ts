import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { accountFeature } from '../feature/account/store/account.reducer';
import { imagesFeature } from '../shared/store/images/images.reducer';

export const metaReducers = [
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  (reducer: ActionReducer<any, any>) =>
    localStorageSync({
      keys: [
        { [imagesFeature.name]: ['images'] },
        { [accountFeature.name]: ['accounts'] },
      ],
      rehydrate: true,
    })(reducer),
];
