import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Undefined } from '../../../../app.types';
import { ModalComponent } from '../../../../shared/content/modal/modal.component';
import { AddAccountComponent } from '../../../account/features/add/add.component';
import { SettingsComponent } from '../../../account/features/settings/settings.component';
import { ShowUserFeaturesComponent } from '../../../account/features/show-user-features/show-user-features.component';
import { AddTimelineComponent } from '../../../timeline/components/add-timeline/add-timeline.component';
import { ModalWindowActions } from '../store/modal-window/modal-window.actions';
import { modalWindowFeature } from '../store/modal-window/modal-window.reducers';
import { ModalWindowType } from '../store/modal-window/modal-window.types';

@Component({
  standalone: true,
  selector: 'app-modal-factory',
  templateUrl: './modal-factory.component.html',
  imports: [
    ModalComponent,
    AddAccountComponent,
    ShowUserFeaturesComponent,
    SettingsComponent,
    AddTimelineComponent,
  ],
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
        return 'features';
      case ModalWindowType.SETTINGS:
        return 'settings';
      case ModalWindowType.ADD_ACCOUNT:
        return 'add new account';
      case ModalWindowType.ADD_TIMELINE:
        return 'add timeline';
      default:
        return '';
    }
  }
}
