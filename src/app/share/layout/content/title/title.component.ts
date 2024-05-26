import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-content-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  title = input.required<string>();
}
