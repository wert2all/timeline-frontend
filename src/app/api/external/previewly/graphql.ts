import { Injectable } from '@angular/core';
import * as ApolloCore from '@apollo/client/core';
import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Upload: { input: File; output: File };
}

export interface ImageProcessOptionInput {
  key: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
}

export enum ImageProcessType {
  resize = 'resize',
}

export interface ImageProcessesInput {
  options: Array<ImageProcessOptionInput>;
  type: ImageProcessType;
}

export enum Status {
  error = 'error',
  pending = 'pending',
  success = 'success',
}

export interface UploadInput {
  extra?: InputMaybe<Scalars['String']['input']>;
  image: Scalars['Upload']['input'];
}

export type UploadImageStatus = {
  id: number;
  name: string;
  status: Status;
  error?: string | null;
  extra?: string | null;
};

export type ImageData = { name: string; url: string };

export type ResizedImage = {
  error?: string | null;
  status: Status;
  image?: ImageData | null;
};

export type Preview = {
  id: number;
  url: string;
  image: string;
  status: Status;
  title?: string | null;
  error?: string | null;
};

export type AddUrlVariables = Exact<{
  token: Scalars['String']['input'];
  url: Scalars['String']['input'];
}>;

export type AddUrl = { preview?: Preview | null };

export type UploadImagesVariables = Exact<{
  token: Scalars['String']['input'];
  images: Array<UploadInput> | UploadInput;
}>;

export type UploadImages = { upload: Array<UploadImageStatus> };

export type GetResizedImageVariables = Exact<{
  token: Scalars['String']['input'];
  imageId: Scalars['Int']['input'];
}>;

export type GetResizedImage = { resizedImage?: ResizedImage | null };

export type GetPreviewVariables = Exact<{
  token: Scalars['String']['input'];
  url: Scalars['String']['input'];
}>;

export type GetPreview = { preview?: Preview | null };

export const UploadImageStatus = gql`
  fragment UploadImageStatus on UploadImageStatus {
    id
    name
    status
    error
    extra
  }
`;
export const ImageData = gql`
  fragment ImageData on ImageData {
    name
    url
  }
`;
export const ResizedImage = gql`
  fragment ResizedImage on ImageProcess {
    error
    image {
      ...ImageData
    }
    status
  }
  ${ImageData}
`;
export const Preview = gql`
  fragment Preview on PreviewData {
    id
    url
    image
    status
    title
    error
  }
`;
export const AddUrlDocument = gql`
  mutation AddUrl($token: String!, $url: String!) {
    preview: addUrl(token: $token, url: $url) {
      ...Preview
    }
  }
  ${Preview}
`;

@Injectable({
  providedIn: 'root',
})
export class AddUrlMutation extends Apollo.Mutation<AddUrl, AddUrlVariables> {
  override document = AddUrlDocument;
  override client = 'previewly';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UploadImagesDocument = gql`
  mutation UploadImages($token: String!, $images: [UploadInput!]!) {
    upload(token: $token, images: $images) {
      ...UploadImageStatus
    }
  }
  ${UploadImageStatus}
`;

@Injectable({
  providedIn: 'root',
})
export class UploadImagesMutation extends Apollo.Mutation<
  UploadImages,
  UploadImagesVariables
> {
  override document = UploadImagesDocument;
  override client = 'previewly';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetResizedImageDocument = gql`
  mutation GetResizedImage($token: String!, $imageId: Int!) {
    resizedImage: processImage(
      imageId: $imageId
      processes: [
        {
          options: [
            { key: "width", value: "490" }
            { key: "height", value: "250" }
          ]
          type: resize
        }
      ]
      token: $token
    ) {
      ...ResizedImage
    }
  }
  ${ResizedImage}
`;

@Injectable({
  providedIn: 'root',
})
export class GetResizedImageMutation extends Apollo.Mutation<
  GetResizedImage,
  GetResizedImageVariables
> {
  override document = GetResizedImageDocument;
  override client = 'previewly';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetPreviewDocument = gql`
  query GetPreview($token: String!, $url: String!) {
    preview: getPreviewData(token: $token, url: $url) {
      ...Preview
    }
  }
  ${Preview}
`;

@Injectable({
  providedIn: 'root',
})
export class GetPreviewQuery extends Apollo.Query<
  GetPreview,
  GetPreviewVariables
> {
  override document = GetPreviewDocument;
  override client = 'previewly';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface WatchQueryOptionsAlone<V extends ApolloCore.OperationVariables>
  extends Omit<ApolloCore.WatchQueryOptions<V>, 'query' | 'variables'> {}

interface QueryOptionsAlone<V>
  extends Omit<ApolloCore.QueryOptions<V>, 'query' | 'variables'> {}

interface MutationOptionsAlone<T, V>
  extends Omit<ApolloCore.MutationOptions<T, V>, 'mutation' | 'variables'> {}

@Injectable({ providedIn: 'root' })
export class previewlyApiClient {
  constructor(
    private addUrlMutation: AddUrlMutation,
    private uploadImagesMutation: UploadImagesMutation,
    private getResizedImageMutation: GetResizedImageMutation,
    private getPreviewQuery: GetPreviewQuery
  ) {}

  addUrl(
    variables: AddUrlVariables,
    options?: MutationOptionsAlone<AddUrl, AddUrlVariables>
  ) {
    return this.addUrlMutation.mutate(variables, options);
  }

  uploadImages(
    variables: UploadImagesVariables,
    options?: MutationOptionsAlone<UploadImages, UploadImagesVariables>
  ) {
    return this.uploadImagesMutation.mutate(variables, options);
  }

  getResizedImage(
    variables: GetResizedImageVariables,
    options?: MutationOptionsAlone<GetResizedImage, GetResizedImageVariables>
  ) {
    return this.getResizedImageMutation.mutate(variables, options);
  }

  getPreview(
    variables: GetPreviewVariables,
    options?: QueryOptionsAlone<GetPreviewVariables>
  ) {
    return this.getPreviewQuery.fetch(variables, options);
  }

  getPreviewWatch(
    variables: GetPreviewVariables,
    options?: WatchQueryOptionsAlone<GetPreviewVariables>
  ) {
    return this.getPreviewQuery.watch(variables, options);
  }
}
