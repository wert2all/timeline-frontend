import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  phosphorPencilSimpleLine,
  phosphorPlus,
} from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-top-dashboard-button',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './top-dashboard-button.component.html',
  styleUrls: ['./top-dashboard-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ phosphorPlus, phosphorPencilSimpleLine })],
})
export class TopDashboardButtonComponent {
  disabled = input<boolean>(false);
  withTooltip = input<boolean>(false);
  showTooltip = input<boolean>(false);
  addEvent = output();
}
