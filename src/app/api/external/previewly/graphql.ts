import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import * as ApolloCore from '@apollo/client/core';
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
}

export enum Status {
  error = 'error',
  pending = 'pending',
  success = 'success',
}

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

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface MutationOptionsAlone<T, V>
  extends Omit<ApolloCore.MutationOptions<T, V>, 'mutation' | 'variables'> {}

@Injectable({ providedIn: 'root' })
export class previewlyApiClient {
  constructor(private addUrlMutation: AddUrlMutation) {}

  addUrl(
    variables: AddUrlVariables,
    options?: MutationOptionsAlone<AddUrl, AddUrlVariables>
  ) {
    return this.addUrlMutation.mutate(variables, options);
  }
}
