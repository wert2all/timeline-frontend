import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-add-event-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-event-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventFormComponent {}
