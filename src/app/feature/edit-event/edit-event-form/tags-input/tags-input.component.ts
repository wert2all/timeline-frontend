import { Component, computed, effect, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxCloseCircleOutline } from '@ng-icons/iconsax/outline';
import { fromInputSignal } from '../../../../libs/signal.functions';
import { ViewTimelineTag } from '../../../timeline/timeline.types';
import { EditEventForm } from '../edit-event-form.types';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-tags-input',
  templateUrl: './tags-input.component.html',
  imports: [ReactiveFormsModule, NgIconComponent],
  viewProviders: [provideIcons({ saxCloseCircleOutline })],
})
export class EditFormTagsInputComponent {
  form = input.required<FormGroup<EditEventForm>>();
  isDisabled = input<boolean>(false);
  inputTags = input<string[]>([]);

  outputTags = output<string[]>();

  private readonly tags = fromInputSignal<string[]>(this.inputTags);

  protected readonly viewTags = computed(() =>
    this.tags().map(tag => new ViewTimelineTag(tag))
  );

  constructor() {
    effect(() => {
      this.outputTags.emit(this.tags());
    });
  }

  addTag(input: HTMLInputElement) {
    const tags = input.value
      ?.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag != '');
    if (tags) {
      input.value = '';
      this.tags.update(existTags => [...existTags, ...tags]);
    }
  }

  removeTag(tag: ViewTimelineTag) {
    this.tags.update(existTags =>
      existTags.filter(existTag => existTag !== tag.value)
    );
  }
}
