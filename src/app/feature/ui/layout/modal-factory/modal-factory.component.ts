import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Undefined } from '../../../../app.types';
import { ModalComponent } from '../../../../shared/content/modal/modal.component';
import { ShowUserFeaturesComponent } from '../../../account/features/show-user-features/show-user-features.component';
import { SettingsComponent } from '../../../account/settings/settings.component';
import { ModalWindowActions } from '../store/modal-window/modal-window.actions';
import { modalWindowFeature } from '../store/modal-window/modal-window.reducers';
import { ModalWindowType } from '../store/modal-window/modal-window.types';

@Component({
  standalone: true,
  selector: 'app-modal-factory',
  templateUrl: './modal-factory.component.html',
  imports: [ModalComponent, ShowUserFeaturesComponent, SettingsComponent],
})
export class ModalFactoryComponent {
  private readonly store = inject(Store);

  protected ModalWindowType = ModalWindowType;
  protected readonly windowType = this.store.selectSignal(
    modalWindowFeature.selectWindowType
  );
  protected readonly windowTitle = computed(() =>
    this.createTitle(this.windowType())
  );

  closeWindow() {
    this.store.dispatch(ModalWindowActions.closeModalWindow());
  }

  private createTitle(type: ModalWindowType | Undefined): string {
    switch (type) {
      case ModalWindowType.FEATURES:
        return 'Features';
      case ModalWindowType.SETTINGS:
        return 'Settings';
      default:
        return '';
    }
  }
}
