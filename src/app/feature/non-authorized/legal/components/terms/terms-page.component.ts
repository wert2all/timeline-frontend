import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleComponent } from '../../../../../shared/layout/content/title/title.component';
import { LayoutComponent } from '../../../../../shared/layout/layout.component';

@Component({
  standalone: true,
  selector: 'app-terms-page',
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LayoutComponent, TitleComponent],
})
export class TermsPageComponent {}
