import { Component, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
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
import { Undefined } from '../../../app.types';
import { FormControlsComponent } from '../../../shared/content/form-controls/controls.component';
import { sharedFeature } from '../../../shared/store/shared/shared.reducers';
import { AccountActions } from '../../../store/account/account.actions';
import { accountFeature } from '../../../store/account/account.reducer';
import { FeatureFlagComponent } from '../../ui/feature-flag/feature-flag.component';
import { ModalWindowActions } from '../../ui/layout/store/modal-window/modal-window.actions';

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
  private readonly activeAccount = this.store.selectSignal(
    sharedFeature.selectActiveAccount
  );
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
  protected accountSettings = this.store.selectSignal(
    sharedFeature.selectActiveAccountFeatureSettings
  );

  constructor() {
    effect(() => {
      const account = this.activeAccount();
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
    throw new Error('Method not implemented.');
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
            settings: this.activeAccount()?.settings || {},
          },
        })
      );
    }
  }

  closeWindow() {
    this.store.dispatch(ModalWindowActions.closeModalWindow());
  }
}
