import { Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxCloseSquareBold } from '@ng-icons/iconsax/bold';
import {
  saxCameraOutline,
  saxCloseSquareOutline,
  saxPenAddOutline,
  saxUserAddOutline,
} from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { FormControlsComponent } from '../../../share/form/controls/controls.component';
import { accountFeature } from '../../../store/account/account.reducer';
import { ApplicationActions } from '../../../store/application/application.actions';

interface SettingForm {
  name: FormControl<string>;
}

@Component({
  standalone: true,
  selector: 'app-change-user-settings',
  templateUrl: './settings.component.html',
  imports: [NgIconComponent, ReactiveFormsModule, FormControlsComponent],
  viewProviders: [
    provideIcons({
      saxPenAddOutline,
      saxCameraOutline,
      saxCloseSquareBold,
      saxCloseSquareOutline,
      saxUserAddOutline,
    }),
  ],
})
export class SettingsComponent {
  private readonly store = inject(Store);
  private readonly activeAccount = this.store.selectSignal(
    accountFeature.selectActiveAccount
  );

  protected form = this.createForm();
  protected valueChanges$ = this.form.valueChanges.pipe(takeUntilDestroyed());

  protected isDisabled = toSignal(
    this.valueChanges$.pipe(map(() => this.form.invalid)),
    { initialValue: false }
  );

  protected icon = saxPenAddOutline;
  protected addAccountIcon = saxUserAddOutline;

  constructor() {
    effect(() => {
      const account = this.activeAccount();
      if (account) {
        this.form.controls.name.setValue(account.name || '');
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
    console.log(this.form.valid);
    throw new Error('Method not implemented.');
  }

  closeWindow() {
    this.store.dispatch(ApplicationActions.closeModalWindow());
  }

  private createForm(): FormGroup<SettingForm> {
    return new FormGroup<SettingForm>({
      name: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }
}
