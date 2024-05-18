import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LayoutComponent } from '../../../share/layout/layout.component';
import { TimelineComponent } from '../../../widgets/timeline-container/timeline-container.component';

@Component({
  selector: 'app-my-page',
  standalone: true,
  templateUrl: './my-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LayoutComponent, TimelineComponent],
})
export class MyPageComponent {}
