import { createFeature, createReducer, on } from '@ngrx/store';
import { AccountActions } from '../../../../../store/account/account.actions';
import { ApplicationActions } from './application.actions';
import { ApplicationState } from './application.types';

const initialState: ApplicationState = {
  loading: false,
  windowType: null,
};

export const applicationFeature = createFeature({
  name: 'application',
  reducer: createReducer(
    initialState,
    on(
      AccountActions.successSaveAccount,
      (state): ApplicationState => ({
        ...state,
        windowType: null,
      })
    ),
    on(
      ApplicationActions.opensModalWindow,
      (state, { windowType }): ApplicationState => ({
        ...state,
        windowType,
      })
    ),

    on(
      ApplicationActions.closeModalWindow,
      (state): ApplicationState => ({
        ...state,
        windowType: null,
      })
    )
  ),
});
