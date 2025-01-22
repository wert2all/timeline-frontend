import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Undefined } from '../../../../app.types';
import { ModalComponent } from '../../../../shared/content/modal/modal.component';
import { ShowUserFeaturesComponent } from '../../../user/features/show-user-features/show-user-features.component';
import { SettingsComponent } from '../../../user/settings/settings.component';
import { ApplicationActions } from '../store/application/application.actions';
import { applicationFeature } from '../store/application/application.reducers';
import { ModalWindowType } from '../store/application/application.types';

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
    applicationFeature.selectWindowType
  );
  protected readonly windowTitle = computed(() =>
    this.createTitle(this.windowType())
  );

  closeWindow() {
    this.store.dispatch(ApplicationActions.closeModalWindow());
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
