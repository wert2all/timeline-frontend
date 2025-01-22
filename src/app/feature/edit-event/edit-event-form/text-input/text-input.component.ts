import { Component, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxMessageQuestionBulk } from '@ng-icons/iconsax/bulk';
import { ModalComponent } from '../../../../shared/content/modal/modal.component';
import { EditEventForm } from '../edit-event-form.types';
import { MarkdownHelpComponent } from '../markdown-help/markdown-help.component';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-text-input',
  templateUrl: './text-input.component.html',
  imports: [
    ReactiveFormsModule,
    NgIconComponent,
    ModalComponent,
    MarkdownHelpComponent,
  ],
  viewProviders: [provideIcons({ saxMessageQuestionBulk })],
})
export class EditFormTextInputComponent {
  form = input.required<FormGroup<EditEventForm>>();

  showHelp = signal(false);
}
