import { Component } from '@angular/core';
import { LayoutComponent } from '../../../../../shared/layout/layout.component';
import { TitleComponent } from '../../../../../shared/ui/layout/content/title/title.component';

@Component({
  standalone: true,
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class TermsPageComponent {}
