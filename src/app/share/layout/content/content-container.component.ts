import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-content-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentContainerComponent {}
