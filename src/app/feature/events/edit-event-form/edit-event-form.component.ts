import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
import { provideIcons } from '@ng-icons/core';
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
import { DateTime } from 'luxon';
import { catchError, debounceTime, distinctUntilChanged, map, of } from 'rxjs';

import { fromInputSignal } from '../../../libs/signal.functions';
import { FormControlsComponent } from '../../../shared/content/form-controls/controls.component';
import { SharedTabsComponent } from '../../../shared/content/tabs/tabs.component';
import { Tabs } from '../../../shared/content/tabs/tabs.types';
import { EventContentTag } from '../../../shared/ui/event/content/content.types';
import { TimelineEvent } from '../../timeline/store/timeline.types';
import { EditEventFormChanges } from '../share/edit-event/edit-event.types';
import { EditFormDateTimeInputComponent } from './date-time-input/date-time-input.component';
import {
  EditEventForm,
  EditEventFormViewHelper,
} from './edit-event-form.types';
import { EditFormLinkInputComponent } from './link-input/link-input.component';
import { EditFormTagsInputComponent } from './tags-input/tags-input.component';
import { EditFormTextInputComponent } from './text-input/text-input.component';
import { EditEventFormUploadInputComponent } from './upload-input/upload-input.component';

const URL_REGEXP =
  // eslint-disable-next-line sonarjs/regex-complexity
  /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;

const TIME_REGEXP = /^([01]?\d|2[0-3]):[0-5]\d$/;

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
    ReactiveFormsModule,
    SharedTabsComponent,
    EditFormTextInputComponent,
    EditFormDateTimeInputComponent,
    EditFormTagsInputComponent,
    EditFormLinkInputComponent,
    EditEventFormUploadInputComponent,
    FormControlsComponent,
  ],
})
export class EditEventFormComponent {
  fileSelected = output<File>();
  urlChanged = output<URL>();
  valuesChanged = output<EditEventFormChanges>();

  saveAction = output();
  dismissAction = output();

  editEvent = input.required<TimelineEvent>();
  viewHelper = input.required<EditEventFormViewHelper>();

  isNew = input(false);
  loading = input(false);
  enableUpload = input(false);

  protected readonly editForm = new FormGroup<EditEventForm>({
    id: new FormControl(null),
    date: new FormControl<string>(DateTime.now().toISODate(), [
      Validators.required,
    ]),
    time: new FormControl<string>(
      DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE),
      [Validators.pattern(TIME_REGEXP)]
    ),
    showTime: new FormControl(false, { nonNullable: true }),
    title: new FormControl('', { nonNullable: true }),
    content: new FormControl('', { nonNullable: true }),
    link: new FormControl(null, [Validators.pattern(URL_REGEXP)]),
    isPrivate: new FormControl(false),
    imageId: new FormControl<number | null>(null),
    tags: new FormControl<string[]>([]),
  });

  private readonly imageId = computed(() => {
    return this.viewHelper().image?.id;
  });
  private formChange$ = this.editForm.valueChanges.pipe(takeUntilDestroyed());

  protected readonly tabs = computed((): Tabs[] => [
    {
      uuid: 'text',
      title: 'text something',
      icon: saxTextBlockOutline,
      isEnabled: true,
    },
    {
      uuid: 'upload',
      title: 'add image',
      icon: saxImageOutline,
      isEnabled: this.enableUpload(),
    },
    {
      uuid: 'date',
      title: 'set date and time',
      icon: saxCalendar1Outline,
      isEnabled: true,
    },
    {
      uuid: 'tags',
      title: 'add tags',
      icon: saxTagOutline,
      isEnabled: true,
    },
    {
      uuid: 'link',
      title: 'add link',
      icon: saxLinkSquareOutline,
      isEnabled: true,
    },
  ]);

  private openTab = computed(() => {
    return this.tabs().slice(0, 1)[0];
  });
  protected readonly activeTab = fromInputSignal(this.openTab);

  protected readonly tags = signal<EventContentTag[]>([]);

  protected readonly submitButton = computed(() =>
    this.isNew()
      ? { title: 'Add', icon: saxCalendarAddOutline }
      : { title: 'Save', icon: saxCalendarTickOutline }
  );

  protected readonly previewLink = toSignal(
    this.editForm.controls.link.valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      map(link => (link ? new URL(link) : null)),
      catchError(() => of(null))
    )
  );

  constructor() {
    effect(() => {
      const event = this.editEvent();

      this.editForm.controls.id.setValue(event.id || null);
      this.editForm.controls.title.setValue(event.title || '');
      this.editForm.controls.content.setValue(event.description || '');

      const date = event.date
        ? DateTime.fromJSDate(event.date)
        : DateTime.now();

      this.editForm.controls.date.setValue(date.toISODate());

      this.editForm.controls.showTime.setValue(event.showTime || false);
      this.editForm.controls.time.setValue(
        date.toLocaleString(DateTime.TIME_24_SIMPLE)
      );

      this.editForm.controls.link.setValue(event.url || null);
      this.editForm.controls.imageId.setValue(event.imageId || null);
      this.editForm.controls.tags.setValue(event.tags || null);
    });
    effect(() => {
      if (this.loading()) {
        this.editForm.controls.title.disable();
        this.editForm.controls.content.disable();

        this.editForm.controls.date.disable();
        this.editForm.controls.time.disable();
        this.editForm.controls.showTime.disable();

        this.editForm.controls.link.disable();
      } else {
        this.editForm.controls.title.enable();
        this.editForm.controls.content.enable();

        this.editForm.controls.date.enable();
        this.editForm.controls.time.enable();
        this.editForm.controls.showTime.enable();

        this.editForm.controls.link.enable();
      }
    });
    effect(() => {
      const url = this.previewLink();
      if (url) {
        this.urlChanged.emit(url);
      }
    });

    effect(() => {
      const imageId = this.imageId();
      if (imageId) {
        this.editForm.controls.imageId.setValue(imageId);
      }
    });

    this.formChange$.subscribe(() => {
      this.valuesChanged.emit(this.editForm.value);
    });
  }

  switchTo(tab: Tabs) {
    this.activeTab.set(tab);
  }

  couldRemoveImage() {
    return !!this.editForm.controls.imageId.value;
  }

  removeImage() {
    this.editForm.controls.imageId.setValue(null);
  }

  handleSelectFile(file: File) {
    this.fileSelected.emit(file);
  }

  setTags(tags: string[]) {
    this.editForm.controls.tags.setValue(tags);
  }

  formSubmit(event: Event) {
    event.preventDefault();
  }
}
