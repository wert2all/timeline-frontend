import { Component } from '@angular/core';
import { TitleComponent } from '../../../../../shared/ui/layout/content/title/title.component';
import { LayoutComponent } from '../../../../../shared/ui/layout/layout.component';

@Component({
  standalone: true,
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class TermsPageComponent {}
