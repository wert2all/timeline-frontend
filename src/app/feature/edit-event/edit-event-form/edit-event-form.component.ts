import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
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
  saxCalendarTickOutline,
  saxImageOutline,
  saxLinkSquareOutline,
  saxTagOutline,
  saxTextBlockOutline,
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
import { ViewTimelineEvent } from '../../../store/timeline/timeline.types';

import { LoaderComponent } from '../../../share/loader/loader.component';
import { accountFeature } from '../../../store/account/account.reducer';
import { UploadActions } from '../../../store/images/images.actions';
import { imagesFeature } from '../../../store/images/images.reducer';
import { timelineFeature } from '../../../store/timeline/timeline.reducer';
import { ViewTimelineTag } from '../../timeline/timeline.types';
import { FeatureFlagComponent } from '../../user/features/feature-flag/feature-flag.component';
import { EditValue } from '../edit-event.types';
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
  imageId: FormControl<number | null>;
}

@Component({
  selector: 'app-edit-event-form',
  standalone: true,
  templateUrl: './edit-event-form.component.html',
  styleUrls: ['./edit-event-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      saxAddOutline,
      saxCalendarAddOutline,
      saxCalendar1Outline,
      saxCalendarTickOutline,
      saxTextBlockOutline,
      saxTagOutline,
      saxLinkSquareOutline,
      saxImageOutline,
    }),
  ],
  imports: [
    CommonModule,
    NgIconComponent,
    ReactiveFormsModule,
    AddEventTagsComponent,
    DatePickerComponent,
    LinkPreviewComponent,
    LoaderComponent,
    FeatureFlagComponent,
  ],
})
export class EditEventFormComponent implements AfterViewInit {
  saveEvent = output();
  valuesChanged = output<EditValue>();
  dismissAction = output();

  editEvent = input<ViewTimelineEvent | null>(null);
  openTab = input(0);
  loading = input(false);

  protected readonly editForm = new FormGroup<EditForm>({
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
    imageId: new FormControl<number | null>(null),
  });

  private formValues = signal<EditValue | null>(null);
  private formChanges$ = this.editForm.valueChanges.pipe(takeUntilDestroyed());
  private store = inject(Store);
  private readonly allPreviews = this.store.selectSignal(
    previewFeature.selectPreviews
  );
  private readonly uploadedImageId = this.store.selectSignal(
    timelineFeature.selectUploadedImageId
  );

  protected previewImage = this.store.selectSignal(
    imagesFeature.selectCurrentUpload
  );

  protected readonly switchTab = signal<null | number>(null);
  protected readonly tags = signal<ViewTimelineTag[]>([]);

  protected isDisabled = computed(() => this.loading() === true);
  protected isEditing = computed(() => !!this.editEvent()?.id);

  protected buttonIcon = computed(() =>
    this.isEditing() ? 'saxCalendarTickOutline' : 'saxCalendarAddOutline'
  );
  protected buttonTitle = computed(() => (this.isEditing() ? 'Save' : 'Add'));
  protected readonly previewLink = toSignal(
    this.formChanges$.pipe(debounceTime(2000), distinctUntilChanged()).pipe(
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

  protected readonly previewHolder = computed(() =>
    this.allPreviews().find(item => item.url === this.previewLink()?.toString())
  );

  protected readonly activeStep = computed(() =>
    this.switchTab() !== null ? this.switchTab() : this.openTab()
  );

  protected accountSettings = this.store.selectSignal(
    accountFeature.selectActiveAccountFeaturesSettings
  );

  constructor() {
    this.editForm.controls.withTime.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(withTime => {
        if (withTime) {
          this.editForm.controls.time.enable();
          this.editForm.controls.showTime.enable();
        } else {
          this.editForm.controls.time.disable();
          this.editForm.controls.showTime.disable();
        }
      });

    this.formChanges$.subscribe(values => {
      this.formValues.set({
        ...values,
        time: values.time,
        withTime: values.withTime,
        url: values.link,
      });
    });

    effect(() => {
      this.updateDisabledControls();
      this.valuesChanged.emit({
        ...(this.formValues() || this.editForm.value),
        tags: this.tags().map(tag => tag.value),
        imageId: this.uploadedImageId(),
      });
    });
  }

  ngAfterViewInit(): void {
    const editEvent = this.editEvent();

    if (editEvent) {
      this.editForm.controls.id.setValue(editEvent.id || null);
      this.editForm.controls.title.setValue(editEvent.title || '');
      this.editForm.controls.content.setValue(editEvent.description);

      this.editForm.controls.date.setValue(
        (editEvent.date.date
          ? DateTime.fromJSDate(editEvent.date.originalDate)
          : DateTime.now()
        ).toISODate()
      );

      this.editForm.controls.withTime.setValue(editEvent.showTime || false);
      this.editForm.controls.showTime.setValue(editEvent.showTime || false);
      this.editForm.controls.time.setValue(editEvent.date.time);

      this.editForm.controls.link.setValue(editEvent.url?.link || null);
      this.editForm.controls.imageId.setValue(editEvent.imageId || null);
      this.tags.set(editEvent.tags);
    }
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

  updateDate(date: Date) {
    this.editForm.controls.date.setValue(DateTime.fromJSDate(date).toISODate());
  }

  isActiveTab(tabNumber: number): boolean {
    return this.activeStep() === tabNumber;
  }

  switchTo(tabNumber: number) {
    this.switchTab.set(tabNumber);
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.store.dispatch(UploadActions.uploadImage({ image: input.files![0] }));
  }

  private updateDisabledControls() {
    if (this.isDisabled()) {
      this.editForm.controls.title.disable();
      this.editForm.controls.content.disable();

      this.editForm.controls.withTime.disable();
      this.editForm.controls.date.disable();
      this.editForm.controls.time.disable();
      this.editForm.controls.showTime.disable();

      this.editForm.controls.link.disable();
    } else {
      this.editForm.controls.title.enable();
      this.editForm.controls.content.enable();

      this.editForm.controls.withTime.enable();
      this.editForm.controls.date.enable();
      this.editForm.controls.time.enable();
      this.editForm.controls.showTime.enable();

      this.editForm.controls.link.enable();
    }
  }
}
