import { Component, effect, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxCloseCircleOutline } from '@ng-icons/iconsax/outline';
import { fromInputSignal } from '../../../../libs/signal.functions';
import { ViewTimelineTag } from '../../../timeline/timeline.types';
import { EditForm } from '../edit-event-form.types';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-tags-input',
  templateUrl: './tags-input.component.html',
  imports: [ReactiveFormsModule, NgIconComponent],
  viewProviders: [provideIcons({ saxCloseCircleOutline })],
})
export class EditFormTagsInputComponent {
  form = input.required<FormGroup<EditForm>>();
  isDisabled = input<boolean>(false);
  inputTags = input<ViewTimelineTag[]>([]);

  outputTags = output<ViewTimelineTag[]>();

  protected readonly tags = fromInputSignal<ViewTimelineTag[]>(this.inputTags);

  constructor() {
    effect(() => {
      this.outputTags.emit(this.tags());
    });
  }

  addTag(input: HTMLInputElement) {
    const tags = input.value
      ?.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag != '')
      .map(tag => new ViewTimelineTag(tag));
    if (tags) {
      input.value = '';
      this.tags.update(existTags => [...existTags, ...tags]);
    }
  }

  removeTag(tag: ViewTimelineTag) {
    this.tags.update(existTags =>
      existTags.filter(existTag => existTag.title !== tag.title)
    );
  }
}
