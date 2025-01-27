import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { saxPenAddOutline } from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { FormControlsComponent } from '../../../../shared/content/form-controls/controls.component';
import { ModalWindowActions } from '../../../ui/layout/store/modal-window/modal-window.actions';
import { AccountActions } from '../../store/account.actions';
import { accountFeature } from '../../store/account.reducer';

interface AddAccountForm {
  name: FormControl<string>;
}

@Component({
  standalone: true,
  selector: 'app-add-account',
  templateUrl: './add.component.html',
  imports: [FormControlsComponent, ReactiveFormsModule],
  viewProviders: [provideIcons({ saxPenAddOutline })],
})
export class AddAccountComponent {
  private readonly store = inject(Store);

  protected icon = saxPenAddOutline;
  protected isLoading = this.store.selectSignal(accountFeature.selectLoading);
  protected form = new FormGroup<AddAccountForm>({
    name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  protected valueChanges$ = this.form.valueChanges.pipe(takeUntilDestroyed());
  protected isDisabled = toSignal(
    this.valueChanges$.pipe(map(() => this.form.invalid)),
    { initialValue: true }
  );

  save() {
    if (this.form.valid) {
      this.store.dispatch(
        AccountActions.dispatchAddNewAcoount({
          name: this.form.controls.name.value,
        })
      );
    }
  }

  closeWindow() {
    this.store.dispatch(ModalWindowActions.closeModalWindow());
  }
}
