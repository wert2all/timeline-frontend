import { Component, computed, effect, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorBackspace } from '@ng-icons/phosphor-icons/regular';
import { fromInputSignal } from '../../../../libs/signal.functions';
import { EventContentTag } from '../../../../shared/ui/event/content/content.types';
import { EditEventForm } from '../edit-event-form.types';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-tags-input',
  templateUrl: './tags-input.component.html',
  imports: [ReactiveFormsModule, NgIconComponent],
  viewProviders: [provideIcons({ phosphorBackspace })],
})
export class EditFormTagsInputComponent {
  form = input.required<FormGroup<EditEventForm>>();
  isDisabled = input<boolean>(false);
  inputTags = input<string[]>([]);

  outputTags = output<string[]>();

  private readonly tags = fromInputSignal<string[]>(this.inputTags);

  protected readonly viewTags = computed(() =>
    this.tags().map(tag => new EventContentTag(tag))
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

  removeTag(tag: EventContentTag) {
    this.tags.update(existTags =>
      existTags.filter(existTag => existTag !== tag.value)
    );
  }
}
