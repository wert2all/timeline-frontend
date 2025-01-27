import { Component, computed, effect, inject } from '@angular/core';
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
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxCloseSquareBold } from '@ng-icons/iconsax/bold';
import { saxUserSquareBulk } from '@ng-icons/iconsax/bulk';
import {
  saxCameraOutline,
  saxCloseSquareOutline,
  saxPenAddOutline,
  saxUserAddOutline,
} from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Undefined } from '../../../../app.types';
import { FormControlsComponent } from '../../../../shared/content/form-controls/controls.component';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { FeatureFlagComponent } from '../../../ui/feature-flag/feature-flag.component';
import { ModalWindowActions } from '../../../ui/layout/store/modal-window/modal-window.actions';
import { ModalWindowType } from '../../../ui/layout/store/modal-window/modal-window.types';
import { toFeaturesSettings } from '../../account.functions';
import { AccountsProvider } from '../../storage/accounts.provider';
import { AccountActions } from '../../store/account.actions';
import { accountFeature } from '../../store/account.reducer';

interface SettingForm {
  accountId: FormControl<number>;
  name: FormControl<string>;
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
  ],
  viewProviders: [
    provideIcons({
      saxPenAddOutline,
      saxCameraOutline,
      saxCloseSquareBold,
      saxCloseSquareOutline,
      saxUserAddOutline,
      saxUserSquareBulk,
    }),
  ],
})
export class SettingsComponent {
  private readonly store = inject(Store);
  private readonly accountProvider = inject(AccountsProvider);
  private readonly activeAccountId = this.store.selectSignal(
    sharedFeature.selectActiveAccoundId
  );
  private readonly accountResource = rxResource({
    request: this.activeAccountId,
    loader: accountId => this.accountProvider.getAccount(accountId.request),
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
    avatarId: new FormControl(),
  });
  protected valueChanges$ = this.form.valueChanges.pipe(takeUntilDestroyed());

  protected isDisabled = toSignal(
    this.valueChanges$.pipe(map(() => this.form.invalid)),
    { initialValue: false }
  );
  protected readonly avatarUrl = computed(() => {
    return null;
  });

  protected icon = saxPenAddOutline;
  protected addAccountIcon = saxUserAddOutline;
  protected featureSettings = computed(() =>
    toFeaturesSettings(this.accountResource.value())
  );

  constructor() {
    effect(() => {
      const account = this.accountResource.value();
      if (account) {
        this.form.controls.accountId.setValue(account.id);
        this.form.controls.name.setValue(account.name || '');
        this.form.controls.avatarId.setValue(null);
      }
    });
  }

  changeAvatar() {
    throw new Error('Method not implemented.');
  }

  removeAvatar() {
    throw new Error('Method not implemented.');
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
