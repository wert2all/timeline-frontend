import { Component, input } from '@angular/core';

@Component({
  selector: 'app-shared-content-title',
  standalone: true,
  templateUrl: './title.component.html',
})
export class TitleComponent {
  title = input.required<string>();
}
