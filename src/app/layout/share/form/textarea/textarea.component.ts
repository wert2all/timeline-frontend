import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
})
export class TextareaComponent {
  error = input<string | null>(null);
  label = input<string>();
}
