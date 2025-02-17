import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { KeyValue } from '../../../app.types';
import { ImagesActions } from '../../../shared/store/images/images.actions';
import { UploadedImage } from '../../../shared/store/images/images.types';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import { ModalWindowActions } from '../../ui/layout/store/modal-window/modal-window.actions';
import { defaultAccountName } from '../account.functions';
import { Account } from '../account.types';
import { AccountActions } from './account.actions';
import { AccountState } from './account.types';

const mergeAccountSettings = (
  account: Account | null,
  { key, value }: KeyValue<string>
): Account | null => {
  if (account) {
    const settings = { ...account?.settings };
    if (settings) {
      settings[key] = value;
    }
    return { ...account, settings };
  } else {
    return null;
  }
};

const updateAvatars = (
  state: AccountState,
  images: UploadedImage[]
): AccountState => {
  const avatarIds = state.accounts
    .map(account => account.avatar.id)
    .filter(id => !!id)
    .map(id => id!);
  if (avatarIds) {
    const accountImages = images
      .filter(image => image.data?.resized_490x250)
      .filter(image => avatarIds.includes(image.id));
    if (accountImages.length > 0) {
      const updatedState: AccountState = {
        ...state,
        accounts: state.accounts.map(account => ({
          ...account,
          avatar: {
            ...account.avatar,
            url: accountImages.find(image => image.id === account.avatar.id)
              ?.data?.resized_490x250,
          },
        })),
      };
      const activeAccount = updatedState.activeAccount;
      const activeAccountImage = activeAccount
        ? accountImages.find(image => image.id === activeAccount.avatar.id)
        : null;
      if (activeAccountImage && updatedState.activeAccount) {
        updatedState.activeAccount = {
          ...updatedState.activeAccount,
          avatar: {
            ...updatedState.activeAccount?.avatar,
            url: activeAccountImage.data?.resized_490x250,
          },
        };
      }

      return updatedState;
    }
  }
  return state;
};

const initialState: AccountState = {
  loading: false,
  accounts: [],
  activeAccount: null,
  currentAvatarUpload: null,
};

export const accountFeature = createFeature({
  name: 'accounts',
  reducer: createReducer(
    initialState,

    on(
      AccountActions.dispatchSaveAccountSettings,
      AccountActions.dispatchAddNewAcoount,
      (state): AccountState => ({
        ...state,
        loading: true,
      })
    ),
    on(
      AccountActions.successSaveAccount,
      AccountActions.successAddNewAccount,
      (state): AccountState => ({
        ...state,
        loading: false,
      })
    ),

    on(AccountActions.updateOneSetting, (state, { key, value }) => ({
      ...state,
      activeAccount: mergeAccountSettings(state.activeAccount, { key, value }),
    })),

    on(
      AccountActions.couldNotAddAccount,
      (state): AccountState => ({
        ...state,
        loading: false,
      })
    ),

    on(
      AccountActions.successSaveAccount,
      AccountActions.successAddNewAccount,
      (state, { account }): AccountState => ({
        ...state,
        accounts: state.accounts.map(acc =>
          acc.id === account.id
            ? { ...account, name: account.name || defaultAccountName }
            : acc
        ),
      })
    ),

    on(
      SharedActions.logout,
      (state): AccountState => ({
        ...state,
        accounts: [],
      })
    ),

    on(
      AccountActions.successAddNewAccount,
      AccountActions.setActiveAccountAfterInit,
      AccountActions.setActiveAccountAfterAuth,
      // SharedActions.switchActiveAccount,
      (state, { account }): AccountState => ({
        ...state,
        activeAccount: account,
      })
    ),

    on(
      SharedActions.successAuthenticated,
      (state, { accounts }): AccountState => ({
        ...state,
        accounts: accounts,
      })
    ),

    on(
      SharedActions.cleanAccount,
      AccountActions.emptyActiveAccount,
      SharedActions.logout,

      AccountActions.errorOnInitAuth,
      SharedActions.dispatchEmptyPreviewlyTokenError,
      (state): AccountState => ({
        ...state,
        activeAccount: null,
      })
    ),

    on(
      AccountActions.updateOneSetting,
      (state, action): AccountState => ({
        ...state,
        activeAccount: mergeAccountSettings(state.activeAccount, {
          key: action.key,
          value: action.value,
        }),
      })
    ),
    on(
      AccountActions.successSaveAccount,
      (state, { account }): AccountState => ({
        ...state,
        activeAccount:
          account.id === state.activeAccount?.id
            ? account
            : state.activeAccount,
      })
    ),

    on(
      ModalWindowActions.closeModalWindow,
      (state): AccountState => ({
        ...state,
        currentAvatarUpload: null,
      })
    ),

    on(
      AccountActions.removeAvatar,
      (state): AccountState => ({
        ...state,
        currentAvatarUpload: null,
      })
    ),
    on(
      AccountActions.uploadAvatar,
      (state, { avatar }): AccountState => ({
        ...state,
        currentAvatarUpload: {
          loading: true,
          previewUrl: avatar.url,
        },
      })
    ),
    on(
      AccountActions.successUploadAvatar,
      (state, { imageId }): AccountState => ({
        ...state,
        currentAvatarUpload: {
          ...state.currentAvatarUpload,
          loading: false,
          imageId: imageId,
        },
      })
    ),
    on(
      AccountActions.failedUploadAvatar,
      (state): AccountState => ({
        ...state,
        currentAvatarUpload: {
          ...state.currentAvatarUpload,
          loading: false,
          error: new Error('Failder to upload avatar'),
        },
      })
    ),
    on(
      ImagesActions.successUpdateImages,
      (state, { images }): AccountState => updateAvatars(state, images)
    )
  ),
  extraSelectors: ({ selectCurrentAvatarUpload }) => ({
    selectIsUploading: createSelector(
      selectCurrentAvatarUpload,
      upload => upload?.loading === true
    ),
    selectCurrentAvatarUploadId: createSelector(
      selectCurrentAvatarUpload,
      upload => upload?.imageId
    ),
  }),
});
