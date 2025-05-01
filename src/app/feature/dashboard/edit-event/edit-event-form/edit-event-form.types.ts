import { FormControl } from '@angular/forms';
import { Undefined } from '../../../../app.types';
import { UploadQuequeImage } from '../../../../shared/store/images/images.types';
import { PreviewHolder } from '../../store/preview/preview.types';

export interface EditEventForm {
  id: FormControl<number | null>;
  date: FormControl<string | null>;
  time: FormControl<string | null>;
  showTime: FormControl<boolean>;
  title: FormControl<string>;
  content: FormControl<string>;
  link: FormControl<string | null>;
  isPrivate: FormControl<boolean | null>;
  imageId: FormControl<number | null>;
  tags: FormControl<string[] | null>;
}

export interface EditEventFormViewHelper {
  url: PreviewHolder | Undefined;
  image: Undefined | UploadQuequeImage;
}
