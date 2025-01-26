import { createFeature, createReducer, on } from '@ngrx/store';
import { AccountActions } from '../../../../account/store/account.actions';
import { ModalWindowActions } from './modal-window.actions';
import { ModalWindowState } from './modal-window.types';

const initialState: ModalWindowState = {
  loading: false,
  windowType: null,
};

export const modalWindowFeature = createFeature({
  name: 'modal-window',
  reducer: createReducer(
    initialState,
    on(
      AccountActions.successSaveAccount,
      (state): ModalWindowState => ({
        ...state,
        windowType: null,
      })
    ),
    on(
      ModalWindowActions.opensModalWindow,
      (state, { windowType }): ModalWindowState => ({
        ...state,
        windowType,
      })
    ),

    on(
      ModalWindowActions.closeModalWindow,
      (state): ModalWindowState => ({
        ...state,
        windowType: null,
      })
    )
  ),
});
