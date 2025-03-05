import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeCopyright, hugeGithub01 } from '@ng-icons/huge-icons';
import {
  saxGhostOutline,
  saxVideoSquareOutline,
} from '@ng-icons/iconsax/outline';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './footer.component.html',
  viewProviders: [
    provideIcons({
      saxVideoSquareOutline,
      saxGhostOutline,
      hugeGithub01,
      hugeCopyright,
    }),
  ],
})
export class FooterComponent {}
