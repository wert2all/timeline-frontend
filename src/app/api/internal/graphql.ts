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
  Time: { input: string; output: string };
}

export interface AddTimeline {
  name?: InputMaybe<Scalars['String']['input']>;
}

export interface Limit {
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}

export interface TimelineEventInput {
  date: Scalars['Time']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  timelineId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TimelineType>;
}

export enum TimelineType {
  default = 'default',
  selebrate = 'selebrate',
}

export type TimelineEvent = {
  id: number;
  date: string;
  type: TimelineType;
  title?: string | null;
  description?: string | null;
};

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

export type AddTimelineEventVariables = Exact<{
  event: TimelineEventInput;
}>;

export type AddTimelineEvent = { event: TimelineEvent };

export type GetEventsVariables = Exact<{
  timelineId: Scalars['Int']['input'];
}>;

export type GetEvents = { events: Array<TimelineEvent> };

export const TimelineEvent = gql`
  fragment TimelineEvent on TimelineEvent {
    id
    date
    type
    title
    description
  }
`;
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
export const AddTimelineEventDocument = gql`
  mutation AddTimelineEvent($event: TimelineEventInput!) {
    event: addEvent(event: $event) {
      ...TimelineEvent
    }
  }
  ${TimelineEvent}
`;

@Injectable({
  providedIn: 'root',
})
export class AddTimelineEventMutation extends Apollo.Mutation<
  AddTimelineEvent,
  AddTimelineEventVariables
> {
  override document = AddTimelineEventDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventsDocument = gql`
  query GetEvents($timelineId: Int!) {
    events: timelineEvents(
      timelineId: $timelineId
      limit: { from: 0, to: 10 }
    ) {
      ...TimelineEvent
    }
  }
  ${TimelineEvent}
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventsQuery extends Apollo.Query<
  GetEvents,
  GetEventsVariables
> {
  override document = GetEventsDocument;

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
export class ApiClient {
  constructor(
    private authorizeMutation: AuthorizeMutation,
    private addTimelineMutationMutation: AddTimelineMutationMutation,
    private addTimelineEventMutation: AddTimelineEventMutation,
    private getEventsQuery: GetEventsQuery
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

  addTimelineEvent(
    variables: AddTimelineEventVariables,
    options?: MutationOptionsAlone<AddTimelineEvent, AddTimelineEventVariables>
  ) {
    return this.addTimelineEventMutation.mutate(variables, options);
  }

  getEvents(
    variables: GetEventsVariables,
    options?: QueryOptionsAlone<GetEventsVariables>
  ) {
    return this.getEventsQuery.fetch(variables, options);
  }

  getEventsWatch(
    variables: GetEventsVariables,
    options?: WatchQueryOptionsAlone<GetEventsVariables>
  ) {
    return this.getEventsQuery.watch(variables, options);
  }
}
