import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeGithub01 } from '@ng-icons/huge-icons';
import {
  saxGhostOutline,
  saxVideoSquareOutline,
} from '@ng-icons/iconsax/outline';
import { LegalFooterMenuComponent } from '../../../../non-authorized/legal/shared/footer-menu/legal-footer-menu.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIconComponent, LegalFooterMenuComponent],
  templateUrl: './footer.component.html',
  viewProviders: [
    provideIcons({ saxVideoSquareOutline, saxGhostOutline, hugeGithub01 }),
  ],
})
export class FooterComponent {}
