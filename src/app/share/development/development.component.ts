import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { EnvironmentType } from '../../../environments/environment.types';
import { PreviewActions } from '../../store/preview/preview.actions';
import { LinkPreviewComponent } from '../../widgets/link-preview/link-preview.component';

@Component({
  selector: 'app-development',
  standalone: true,
  imports: [CommonModule, LinkPreviewComponent],
  templateUrl: './development.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentComponent implements AfterViewInit {
  readonly url = new URL('https://thum.io');
  private store = inject(Store);

  ngAfterViewInit(): void {
    this.store.dispatch(PreviewActions.addURL({ url: this.url }));
  }

  shouldShow() {
    return environment.type === EnvironmentType.development;
  }
}
