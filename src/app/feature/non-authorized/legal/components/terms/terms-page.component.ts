import { Component } from '@angular/core';
import { TitleComponent } from '../../../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../../../shared/layout/layout.component';

@Component({
  standalone: true,
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class TermsPageComponent {}
