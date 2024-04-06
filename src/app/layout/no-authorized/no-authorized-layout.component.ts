import { Component } from '@angular/core';
import { FooterComponent } from '../share/footer/footer.component';
import { HeaderComponent } from '../share/header/header.component';

@Component({
  selector: 'app-no-authorized-layout',
  standalone: true,
  templateUrl: './no-authorized-layout.component.html',
  imports: [FooterComponent, HeaderComponent],
})
export class NoAuthorizedLayoutComponent {}
