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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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

interface EditForm {
  id: FormControl<number | null>;
  date: FormControl<string | null>;
  time: FormControl<string | null>;
  withTime: FormControl<boolean>;
  showTime: FormControl<boolean>;
  title: FormControl<string>;
  content: FormControl<string>;
  link: FormControl<string | null>;
  isPrivate: FormControl<boolean | null>;
}

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

  editForm = new FormGroup<EditForm>({
    id: new FormControl(null),
    date: new FormControl<string>(DateTime.now().toISODate(), [
      Validators.required,
    ]),
    time: new FormControl<string>(
      DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE),
      [Validators.pattern(TIME_REGEXP)]
    ),
    withTime: new FormControl(false, { nonNullable: true }),
    showTime: new FormControl(false, { nonNullable: true }),
    title: new FormControl('', { nonNullable: true }),
    content: new FormControl('', { nonNullable: true }),
    link: new FormControl(null, [Validators.pattern(URL_REGEXP)]),
    isPrivate: new FormControl(false),
  });

  private formValues = signal<AddValue | null>(null);
  private formChanges$ = this.editForm.valueChanges.pipe(takeUntilDestroyed());
  private store = inject(Store);
  private readonly allPreviews = this.store.selectSignal(
    previewFeature.selectPreviews
  );

  switchTab = signal<null | number>(null);
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

  previewHolder = computed(() =>
    this.allPreviews().find(item => item.url === this.previewLink()?.toString())
  );

  activeStep = computed(() =>
    this.switchTab() !== null ? this.switchTab() : this.openTab()
  );

  constructor() {
    this.editForm.controls.time.disable();
    this.editForm.controls.showTime.disable();

    this.formChanges$.subscribe(values => {
      this.formValues.set({
        ...values,
        time: values.time,
        withTime: values.withTime,
        url: values.link,
      });
    });

    effect(() => {
      this.changeValues.emit({
        ...(this.formValues() || this.editForm.value),
        tags: this.tags().map(tag => tag.value),
      });
    });
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
    if (this.editForm.controls.withTime.value) {
      this.editForm.controls.time.enable();
      this.editForm.controls.showTime.enable();
    } else {
      this.editForm.controls.time.disable();
      this.editForm.controls.showTime.disable();
    }
  }

  updateDate(date: Date) {
    this.editForm.controls.date.setValue(DateTime.fromJSDate(date).toISODate());
  }

  isActiveTab(tabNUmber: number): boolean {
    return this.activeStep() === tabNUmber;
  }

  switchTo(tabNumber: number) {
    this.switchTab.set(tabNumber);
  }
}
