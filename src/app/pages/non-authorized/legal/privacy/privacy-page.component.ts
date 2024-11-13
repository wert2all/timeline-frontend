import { Component } from '@angular/core';
import { TitleComponent } from '../../../../share/layout/content/title/title.component';
import { LayoutComponent } from '../../../../share/layout/layout.component';

@Component({
  standalone: true,
  selector: 'app-privacy-page',
  templateUrl: './privacy-page.component.html',
  styleUrls: ['./privacy-page.component.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class PrivacyPageComponent {}
