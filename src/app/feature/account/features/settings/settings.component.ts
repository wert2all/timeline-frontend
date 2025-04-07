import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
} from '@angular/core';
import {
  rxResource,
  takeUntilDestroyed,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import {
  phosphorPencilSimpleLine,
  phosphorUserPlus,
} from '@ng-icons/phosphor-icons/regular';
import { Store, createSelector } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { Undefined } from '../../../../app.types';
import { FormControlsComponent } from '../../../../shared/content/form-controls/controls.component';
import { imagesFeature } from '../../../../shared/store/images/images.reducer';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { FeatureFlagComponent } from '../../../ui/feature-flag/feature-flag.component';
import { ModalWindowActions } from '../../../ui/layout/store/modal-window/modal-window.actions';
import { ModalWindowType } from '../../../ui/layout/store/modal-window/modal-window.types';
import { AccountsService } from '../../share/accounts.service';
import { AccountActions } from '../../store/account.actions';
import { accountFeature } from '../../store/account.reducer';
import { SettingsAvatarContainerComponent } from './avatar/avatar-container.component';

interface SettingForm {
  accountId: FormControl<number>;
  name: FormControl<string>;
  about: FormControl<string>;
  avatarId: FormControl<number | Undefined>;
}

@Component({
  standalone: true,
  selector: 'app-change-user-settings',
  templateUrl: './settings.component.html',
  imports: [
    ReactiveFormsModule,
    FormControlsComponent,
    NgIconComponent,
    FeatureFlagComponent,
    SettingsAvatarContainerComponent,
  ],
})
export class SettingsComponent {
  private readonly store = inject(Store);
  private readonly accountsService = inject(AccountsService);

  private readonly activeAccount = this.store.selectSignal(
    accountFeature.selectActiveAccount
  );
  private readonly activeAccountId = computed(
    () => this.activeAccount()?.id || 0
  );

  private readonly accountResource = rxResource({
    request: this.activeAccountId,
    loader: ({ request }) =>
      this.accountsService.getAccounts().pipe(
        map(accounts => accounts.find(account => account.id == request)),
        tap(account => {
          if (account?.avatar.id) {
            this.store.dispatch(
              SharedActions.dispatchLoadingImages({ ids: [account.avatar.id] })
            );
          }
        })
      ),
  });
  protected isLoading = this.store.selectSignal(accountFeature.selectLoading);

  protected form = new FormGroup<SettingForm>({
    accountId: new FormControl(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    about: new FormControl(),
    avatarId: new FormControl(),
  });
  protected valueChanges$ = this.form.valueChanges.pipe(takeUntilDestroyed());

  protected isDisabled = toSignal(
    this.valueChanges$.pipe(map(() => this.form.invalid)),
    { initialValue: false }
  );

  private readonly currentUpload = this.store.selectSignal(
    accountFeature.selectCurrentAvatarUpload
  );
  private currentAvatarId = linkedSignal({
    source: this.accountResource.value,
    computation: param => param?.avatar.id,
  });
  protected readonly avatarUrl = computed(() => {
    const currentUploadAvatar = this.currentUpload()?.previewUrl;
    const currentAvatarId = this.currentAvatarId();
    const selectAvatar = createSelector(
      imagesFeature.selectLoadedImages,
      images => images.find(image => image.id == currentAvatarId)
    );
    const currentAccountAvatar =
      this.store.selectSignal(selectAvatar)()?.data?.avatar.full;
    return currentUploadAvatar || currentAccountAvatar;
  });
  private readonly uploadedAvatarId = this.store.selectSignal(
    accountFeature.selectCurrentAvatarUploadId
  );

  protected icon = phosphorPencilSimpleLine;
  protected addAccountIcon = phosphorUserPlus;
  protected isUploading = this.store.selectSignal(
    accountFeature.selectIsUploading
  );

  constructor() {
    effect(() => {
      const account = this.accountResource.value();
      if (account) {
        this.form.controls.accountId.setValue(account.id);
        this.form.controls.name.setValue(account.name || '');
        this.form.controls.about.setValue(account.about || '');
        this.form.controls.avatarId.setValue(account.avatar?.id);
      }
    });
    effect(() => {
      this.currentAvatarId.set(this.uploadedAvatarId());
    });
    effect(() => {
      this.form.controls.avatarId.setValue(this.currentAvatarId());
    });
  }

  changeAvatar(avatar: { file: File; url: string }) {
    const account = this.activeAccount();
    if (account) {
      this.store.dispatch(AccountActions.uploadAvatar({ avatar, account }));
    }
  }

  removeAvatar() {
    this.store.dispatch(AccountActions.removeAvatar());
    this.currentAvatarId.set(null);
  }

  addAccount() {
    this.store.dispatch(
      ModalWindowActions.opensModalWindow({
        windowType: ModalWindowType.ADD_ACCOUNT,
      })
    );
  }

  save() {
    const accountId = this.form.value.accountId;
    const name = this.form.value.name;
    if (this.form.valid && accountId && name) {
      this.store.dispatch(
        AccountActions.dispatchSaveAccountSettings({
          settings: {
            accountId,
            name,
            avatarId: this.form.value.avatarId,
            about: this.form.value.about,
            settings: this.accountResource.value()?.settings || {},
          },
        })
      );
    }
  }

  closeWindow() {
    this.store.dispatch(ModalWindowActions.closeModalWindow());
  }
}
