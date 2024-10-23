import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxAddOutline,
  saxCalendar1Outline,
  saxCalendarAddOutline,
} from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  tap,
} from 'rxjs';
import { DatePickerComponent } from '../../../share/date-picker/date-picker.component';
import { PreviewActions } from '../../../store/preview/preview.actions';
import { previewFeature } from '../../../store/preview/preview.reducers';
import { AddValue, ViewTimelineTag } from '../timeline.types';
import { AddEventTagsComponent } from './add-event-tags/add-event-tags.component';
import { LinkPreviewComponent } from './link-preview/link-preview.component';

const URL_REGEXP =
  /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;

const TIME_REGEXP = /^([01]?\d|2[0-3]):[0-5]\d$/;

@Component({
  selector: 'app-edit-event-form',
  standalone: true,
  templateUrl: './edit-event-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      saxAddOutline,
      saxCalendarAddOutline,
      saxCalendar1Outline,
    }),
  ],
  imports: [
    CommonModule,
    NgIconComponent,
    ReactiveFormsModule,
    AddEventTagsComponent,
    DatePickerComponent,
    LinkPreviewComponent,
  ],
})
export class EditEventFormComponent {
  saveEvent = output();
  changeValues = output<AddValue>();

  openTab = input(0);

  activeStep = signal(0);

  form = inject(FormBuilder).group({
    id: [null],
    date: [DateTime.now().toISODate(), Validators.required],
    time: [
      DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE),
      Validators.pattern(TIME_REGEXP),
    ],
    withTime: [false],
    showTime: [true],
    title: [''],
    content: [''],
    link: [null, [Validators.pattern(URL_REGEXP)]],
  });

  private formValues = signal<AddValue | null>(null);
  private formChanges$ = this.form.valueChanges.pipe(takeUntilDestroyed());
  private store = inject(Store);
  private readonly allPreviews = this.store.selectSignal(
    previewFeature.selectPreviews
  );

  tags = signal<ViewTimelineTag[]>([]);

  previewLink = toSignal(
    this.formChanges$
      .pipe(takeUntilDestroyed(), debounceTime(2000), distinctUntilChanged())
      .pipe(
        map(values => values.link),
        map(link => (link ? new URL(link) : null)),
        map(url => url || null),
        tap(url => {
          if (url) {
            this.store.dispatch(PreviewActions.addURL({ url }));
          }
        }),
        catchError(() => of(null))
      )
  );

  previewHolder = computed(() => {
    return this.allPreviews().find(
      item => item.url === this.previewLink()?.toString()
    );
  });

  constructor() {
    this.form.controls.time.disable();
    this.form.controls.showTime.disable();

    this.formChanges$.subscribe(values => {
      this.formValues.set({
        ...values,
        time: values.time,
        withTime: values.withTime,
        url: values.link,
      });
    });

    effect(
      () => {
        this.activeStep.set(this.openTab());

        this.changeValues.emit({
          ...(this.formValues() || this.form.value),
          tags: this.tags().map(tag => tag.value),
        });
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  addTag(input: HTMLInputElement) {
    const tags = input.value
      ?.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag != '')
      .map(tag => new ViewTimelineTag(tag));
    if (tags) {
      input.value = '';
      this.tags.update(existTags => [...existTags, ...tags]);
    }
  }

  removeTag(tag: ViewTimelineTag) {
    this.tags.update(existTags =>
      existTags.filter(existTag => existTag.title !== tag.title)
    );
  }

  handleWithTimeChange() {
    if (this.form.controls.withTime.value) {
      this.form.controls.time.enable();
      this.form.controls.showTime.enable();
    } else {
      this.form.controls.time.disable();
      this.form.controls.showTime.disable();
    }
  }

  updateDate(date: Date) {
    this.form.controls.date.setValue(DateTime.fromJSDate(date).toISODate());
  }
}
