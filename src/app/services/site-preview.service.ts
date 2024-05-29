import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export type Preview = {
  url: string;
  image: string;
  title?: string;
  description?: string;
};

@Injectable({ providedIn: 'root' })
export class SitePreviewService {
  private apiKey: string;

  constructor() {
    this.apiKey = environment.thumApiKey;
  }

  getPreview(url: string): Preview {
    return {
      url: url,
      image: `https://image.thum.io/get/auth/${this.apiKey}/${url}`,
    };
  }
}
