import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxAddOutline } from '@ng-icons/iconsax/outline';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-event-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './add-event-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxAddOutline })],
})
export class AddEventButtonComponent {
  @Output() addEvent = new Subject();
}
