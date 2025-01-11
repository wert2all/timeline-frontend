import { FormControl } from '@angular/forms';

export interface EditForm {
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
