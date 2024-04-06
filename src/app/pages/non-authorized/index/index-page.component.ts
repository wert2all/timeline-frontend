import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { NoAuthorizedLayoutComponent } from '../../../layout/no-authorized/no-authorized-layout.component';
@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [CommonModule, NoAuthorizedLayoutComponent, NgIconComponent],
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroCheckCircleSolid })],
})
export class IndexPageComponent {}
