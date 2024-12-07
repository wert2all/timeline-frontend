import { createFeature, createReducer } from '@ngrx/store';
import { AccountState } from './account.types';

const initialState: AccountState = {
  activeAccount: null,
};

export const accountFeature = createFeature({
  name: 'account',
  reducer: createReducer(initialState),
});
