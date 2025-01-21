import { Component } from '@angular/core';
import { TitleComponent } from '../../../../../shared/layout/content/title/title.component';
import { LayoutComponent } from '../../../../../shared/layout/layout.component';

@Component({
  standalone: true,
  templateUrl: './privacy-page.component.html',
  styleUrls: ['./privacy-page.component.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class PrivacyPageComponent {}
