import { Component } from '@angular/core';
import { LayoutComponent } from '../../../../../shared/layout/layout.component';
import { TitleComponent } from '../../../../../shared/ui/layout/content/title/title.component';

@Component({
  standalone: true,
  templateUrl: './cookie-page.component.html',
  styleUrls: ['./cookie-page.component.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class CookiePageComponent {}
