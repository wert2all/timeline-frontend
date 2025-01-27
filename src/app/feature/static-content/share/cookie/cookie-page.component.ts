import { Component } from '@angular/core';
import { TitleComponent } from '../../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';

@Component({
  standalone: true,
  templateUrl: './cookie-page.component.html',
  styleUrls: ['../../static-content.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class CookiePageComponent {}
