import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { previewlyApiClient } from '../../api/external/previewly/graphql';
import { DataWrapper, Status, Unique } from '../../app.types';
import { apiAssertNotNull, extractApiData } from '../../libs/api.functions';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly apiClient = inject(previewlyApiClient);

  uploadImage(
    images: File[],
    accountId: number,
    token: string
  ): Observable<DataWrapper<Unique & { id: number }>[]> {
    return this.apiClient
      .uploadImages({
        images: images.map(image => ({ image, extra: accountId.toString() })),
        token,
      })
      .pipe(
        map(result =>
          apiAssertNotNull(
            extractApiData(result)?.upload,
            'Could not upload images'
          )
        ),
        map(images =>
          images.map(image => ({
            status: this.convertStatus(image.status),
            data:
              image.status === 'success'
                ? { id: image.id, uuid: image.name }
                : undefined,
            error: image.error ? new Error(image.error) : undefined,
          }))
        )
      );
  }

  private convertStatus(status: string): Status {
    switch (status) {
      case 'pending':
        return Status.LOADING;
      case 'success':
        return Status.SUCCESS;
      default:
        return Status.ERROR;
    }
  }
}
