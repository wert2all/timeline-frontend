import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxVideoSquareOutline } from '@ng-icons/iconsax/outline';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxVideoSquareOutline })],
})
export class FooterComponent {}
