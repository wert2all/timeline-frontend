import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from '../../../../../shared/content/hero/hero.component';

@Component({
  selector: 'app-develop-content',
  standalone: true,
  imports: [CommonModule, HeroComponent],
  templateUrl: './develop-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopContentComponent {}
