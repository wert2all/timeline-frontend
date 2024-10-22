import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type Preview = {
  url: string;
  image: string;
  title?: string;
  description?: string;
};

@Injectable({ providedIn: 'root' })
export class ThumioService {
  getPreview(url: string): Preview {
    return {
      url: url,
      image: `https://image.thum.io/get/auth/${environment.services.thumio.apiKey}/${url}`,
    };
  }
}
