import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NoAuthorizedLayoutComponent } from '../../../layout/no-authorized/no-authorized-layout.component';
import { TimelineComponent } from '../../../widgets/timeline-container/timeline-container.component';

@Component({
  selector: 'app-my-page',
  standalone: true,
  templateUrl: './my-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NoAuthorizedLayoutComponent, TimelineComponent],
})
export class MyPageComponent {}
