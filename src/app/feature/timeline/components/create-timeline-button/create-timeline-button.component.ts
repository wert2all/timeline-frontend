import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorTreeView } from '@ng-icons/phosphor-icons/regular';
import { AddTimelineComponent } from '../../../../feature/timeline/components/add-timeline/add-timeline.component';
import { ModalComponent } from '../../../../shared/content/modal/modal.component';

@Component({
  selector: 'app-create-timeline-button',
  standalone: true,
  templateUrl: './create-timeline-button.component.html',
  viewProviders: [provideIcons({ phosphorTreeView })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgIconComponent,
    ModalComponent,
    AddTimelineComponent,
  ],
})
export class CreateTimelineButtonComponent {
  isAuthorized = input.required<boolean>();
  isLoading = input.required<boolean>();
  isLarge = input<boolean>(false);

  addTimeline = output<string | null>();

  showAddTimelineWindow = signal(false);
  size = computed(() => (this.isLarge() ? '32' : '24'));
}
