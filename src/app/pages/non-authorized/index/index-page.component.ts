import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TimelineComponent } from '../../../widgets/timeline/timeline.component';
import { NoAuthorizedLayoutComponent } from '../../../layout/no-authorized/no-authorized-layout.component';

@Component({
  selector: 'app-index-page',
  standalone: true,
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TimelineComponent, NoAuthorizedLayoutComponent],
})
export class IndexPageComponent {}
