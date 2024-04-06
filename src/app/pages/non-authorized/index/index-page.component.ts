import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NoAuthorizedLayoutComponent } from '../../../layout/no-authorized/no-authorized-layout.component';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [CommonModule, NoAuthorizedLayoutComponent],
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPageComponent {}
