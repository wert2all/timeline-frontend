import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxAddSquareOutline,
  saxLogin1Outline,
} from '@ng-icons/iconsax/outline';

@Component({
  selector: 'app-add-timeline',
  standalone: true,
  imports: [CommonModule, NgIconComponent, ReactiveFormsModule],
  templateUrl: './add-timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxLogin1Outline, saxAddSquareOutline })],
})
export class AddTimelineComponent {
  isAuthorized = input.required<boolean>();
  isLoading = input.required<boolean>();
  addTimeline = output<string | null>();

  readonly form = inject(FormBuilder).group({ timelineName: [''] });
}
