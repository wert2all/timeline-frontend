import { Component } from '@angular/core';
import { TitleComponent } from '../../../../share/layout/content/title/title.component';
import { LayoutComponent } from '../../../../share/layout/layout.component';

@Component({
  standalone: true,
  selector: 'app-cookie',
  templateUrl: './cookie-page.component.html',
  styleUrls: ['./cookie-page.component.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class CookiePageComponent {}
