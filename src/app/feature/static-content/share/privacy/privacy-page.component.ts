import { Component } from '@angular/core';
import { TitleComponent } from '../../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';

@Component({
  standalone: true,
  templateUrl: './privacy-page.component.html',
  styleUrls: ['../../static-content.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class PrivacyPageComponent {}
