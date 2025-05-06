import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  phosphorArrowLeft,
  phosphorPencilSimpleLine,
  phosphorPlus,
  phosphorTreeView,
} from '@ng-icons/phosphor-icons/regular';
import { Undefined } from '../../../app.types';

@Component({
  selector: 'app-top-dashboard-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './top-dashboard-button.component.html',
  styleUrls: ['./top-dashboard-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      phosphorPlus,
      phosphorPencilSimpleLine,
      phosphorTreeView,
      phosphorArrowLeft,
    }),
  ],
})
export class TopDashboardButtonComponent {
  timelineId = input<number | Undefined>(null);
  isLoading = input<boolean>(false);
  isEditing = input<boolean>(false);
  isEmptyTimeline = input<boolean>(false);

  protected buttonState = computed(() => ({
    tooltip: {
      open: this.isEmptyTimeline(),
      tip: this.getTooltip(this.isEmptyTimeline(), this.isEditing()),
    },
    click: this.isEditing() ? this.dismissEdit : this.addEvent,
    icon: this.isEditing() ? phosphorArrowLeft : phosphorPlus,
    secontIcon: this.isEditing() ? phosphorArrowLeft : phosphorPencilSimpleLine,
  }));

  addEvent = output();
  addTimeline = output();
  dismissEdit = output();

  private getTooltip(isEmptyTimeline: boolean, isEditing: boolean): string {
    if (isEmptyTimeline) {
      return 'now you can add your first event';
    }
    return isEditing ? 'dismiss edit' : 'add new event';
  }
}
