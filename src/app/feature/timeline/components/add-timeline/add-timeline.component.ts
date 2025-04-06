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
  phosphorPlusSquare,
  phosphorSignIn,
} from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-add-timeline',
  standalone: true,
  imports: [CommonModule, NgIconComponent, ReactiveFormsModule],
  templateUrl: './add-timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ phosphorSignIn, phosphorPlusSquare })],
})
export class AddTimelineComponent {
  isAuthorized = input.required<boolean>();
  isLoading = input.required<boolean>();
  addTimeline = output<string | null>();

  readonly form = inject(FormBuilder).group({ timelineName: [''] });
}
