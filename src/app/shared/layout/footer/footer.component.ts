import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeGithub01 } from '@ng-icons/huge-icons';
import {
  saxGhostOutline,
  saxVideoSquareOutline,
} from '@ng-icons/iconsax/outline';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ saxVideoSquareOutline, saxGhostOutline, hugeGithub01 }),
  ],
})
export class FooterComponent {}
