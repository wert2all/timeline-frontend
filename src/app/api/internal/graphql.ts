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
  Time: { input: Date; output: Date };
}

export interface AddTimeline {
  name?: InputMaybe<Scalars['String']['input']>;
}

export interface TimelineEventInput {
  date: Scalars['Time']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  timelineId: Scalars['Int']['input'];
  type?: InputMaybe<TimelineType>;
}

export enum TimelineType {
  default = 'default',
  selebrate = 'selebrate',
}

export type ShortTimeline = { id: number; name?: string | null };

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  timelines: Array<ShortTimeline>;
};

export type AuthorizeVariables = Exact<{ [key: string]: never }>;

export type Authorize = { profile?: User | null };

export type AddTimelineMutationVariables = Exact<{
  timeline?: InputMaybe<AddTimeline>;
}>;

export type AddTimelineMutation = { timeline: ShortTimeline };

export const ShortTimeline = gql`
  fragment ShortTimeline on ShortUserTimeline {
    id
    name
  }
`;
export const User = gql`
  fragment User on User {
    id
    name
    email
    avatar
    timelines {
      ...ShortTimeline
    }
  }
  ${ShortTimeline}
`;
export const AuthorizeDocument = gql`
  mutation Authorize {
    profile: authorize {
      ...User
    }
  }
  ${User}
`;

@Injectable({
  providedIn: 'root',
})
export class AuthorizeMutation extends Apollo.Mutation<
  Authorize,
  AuthorizeVariables
> {
  override document = AuthorizeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AddTimelineMutationDocument = gql`
  mutation AddTimelineMutation($timeline: AddTimeline) {
    timeline: addTimeline(timeline: $timeline) {
      ...ShortTimeline
    }
  }
  ${ShortTimeline}
`;

@Injectable({
  providedIn: 'root',
})
export class AddTimelineMutationMutation extends Apollo.Mutation<
  AddTimelineMutation,
  AddTimelineMutationVariables
> {
  override document = AddTimelineMutationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface MutationOptionsAlone<T, V>
  extends Omit<ApolloCore.MutationOptions<T, V>, 'mutation' | 'variables'> {}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  constructor(
    private authorizeMutation: AuthorizeMutation,
    private addTimelineMutationMutation: AddTimelineMutationMutation
  ) {}

  authorize(
    variables?: AuthorizeVariables,
    options?: MutationOptionsAlone<Authorize, AuthorizeVariables>
  ) {
    return this.authorizeMutation.mutate(variables, options);
  }

  addTimelineMutation(
    variables?: AddTimelineMutationVariables,
    options?: MutationOptionsAlone<
      AddTimelineMutation,
      AddTimelineMutationVariables
    >
  ) {
    return this.addTimelineMutationMutation.mutate(variables, options);
  }
}
