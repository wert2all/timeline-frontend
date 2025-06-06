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

export interface AccountSettingInput {
  key: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
}

export interface AddTimeline {
  accountId: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
}

export interface ExistTimelineEventInput {
  date: Scalars['Time']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  previewlyImageId?: InputMaybe<Scalars['Int']['input']>;
  showTime?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  timelineId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TimelineType>;
  url?: InputMaybe<Scalars['String']['input']>;
}

export interface Limit {
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
}

export interface SaveAccountInput {
  about?: InputMaybe<Scalars['String']['input']>;
  avatarID?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
}

export enum Status {
  error = 'error',
  success = 'success',
}

export interface TimelineEventInput {
  date: Scalars['Time']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  previewlyImageId?: InputMaybe<Scalars['Int']['input']>;
  showTime?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  timelineId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TimelineType>;
  url?: InputMaybe<Scalars['String']['input']>;
}

export enum TimelineType {
  default = 'default',
  selebrate = 'selebrate',
}

export type PageInfo = {
  startCursor?: string | null;
  endCursor?: string | null;
  hasNextPage: boolean;
};

export type TimelineEvent = {
  id: number;
  date: string;
  type: TimelineType;
  title?: string | null;
  timelineId: number;
  description?: string | null;
  showTime?: boolean | null;
  url?: string | null;
  tags: Array<string>;
  previewlyImageId?: number | null;
};

export type ShortTimeline = { id: number; name?: string | null };

export type TimelineEvents = { events: Array<TimelineEvent>; page: PageInfo };

export type Timeline = {
  id: number;
  name?: string | null;
  account: {
    id: number;
    name?: string | null;
    about?: string | null;
    avatarId?: number | null;
  };
};

export type User = {
  id: number;
  name?: string | null;
  email: string;
  accounts: Array<ShortAccount | null>;
};

export type ShortAccount = {
  id: number;
  name?: string | null;
  about?: string | null;
  previewlyToken: string;
  avatarId?: number | null;
  settings: Array<Settings>;
};

export type Settings = { key: string; value: string };

export type AuthorizeVariables = Exact<{ [key: string]: never }>;

export type Authorize = { profile?: User | null };

export type AddTimelineMutationVariables = Exact<{
  timeline?: InputMaybe<AddTimeline>;
}>;

export type AddTimelineMutation = {
  timeline: { id: number; name?: string | null; accountId: number };
};

export type AddTimelineEventVariables = Exact<{
  event: TimelineEventInput;
}>;

export type AddTimelineEvent = { event: TimelineEvent };

export type SaveExistTimelineEventVariables = Exact<{
  event: ExistTimelineEventInput;
}>;

export type SaveExistTimelineEvent = { event: TimelineEvent };

export type DeleteEventVariables = Exact<{
  eventId: Scalars['Int']['input'];
}>;

export type DeleteEvent = { deleteEvent: Status };

export type SaveAccountSettingsVariables = Exact<{
  accountId: Scalars['Int']['input'];
  settings:
    | Array<InputMaybe<AccountSettingInput>>
    | InputMaybe<AccountSettingInput>;
}>;

export type SaveAccountSettings = { saveSettings: Status };

export type SaveAccountVariables = Exact<{
  accountId: Scalars['Int']['input'];
  account: SaveAccountInput;
}>;

export type SaveAccount = { account: ShortAccount };

export type AddAccountVariables = Exact<{
  name: Scalars['String']['input'];
}>;

export type AddAccount = { account: ShortAccount };

export type GetEventsVariables = Exact<{
  timelineId: Scalars['Int']['input'];
  accountId?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetEvents = { events: TimelineEvents };

export type GetAccountTimelinesVariables = Exact<{
  accountId: Scalars['Int']['input'];
}>;

export type GetAccountTimelines = { timelines: Array<ShortTimeline> };

export type GetTimelineVariables = Exact<{
  timelineId: Scalars['Int']['input'];
}>;

export type GetTimeline = { timeline?: Timeline | null };

export type GetEventVariables = Exact<{
  eventId: Scalars['Int']['input'];
  accountId?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetEvent = {
  event?:
    | ({ timeline: { account: ShortAccount } & Timeline } & TimelineEvent)
    | null;
};

export const ShortTimeline = gql`
  fragment ShortTimeline on ShortTimeline {
    id
    name
  }
`;
export const TimelineEvent = gql`
  fragment TimelineEvent on TimelineEvent {
    id
    date
    type
    title
    timelineId
    description
    showTime
    url
    tags
    previewlyImageId
  }
`;
export const PageInfo = gql`
  fragment PageInfo on PageInfo {
    startCursor
    endCursor
    hasNextPage
  }
`;
export const TimelineEvents = gql`
  fragment TimelineEvents on TimelineEvents {
    events {
      ...TimelineEvent
    }
    page {
      ...PageInfo
    }
  }
  ${TimelineEvent}
  ${PageInfo}
`;
export const Timeline = gql`
  fragment Timeline on Timeline {
    id
    name
    account {
      id
      name
      about
      avatarId
    }
  }
`;
export const Settings = gql`
  fragment Settings on AccountSettings {
    key
    value
  }
`;
export const ShortAccount = gql`
  fragment ShortAccount on ShortAccount {
    id
    name
    about
    previewlyToken
    avatarId
    settings {
      ...Settings
    }
  }
  ${Settings}
`;
export const User = gql`
  fragment User on User {
    id
    name
    email
    accounts {
      ...ShortAccount
    }
  }
  ${ShortAccount}
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
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AddTimelineMutationDocument = gql`
  mutation AddTimelineMutation($timeline: AddTimeline) {
    timeline: addTimeline(timeline: $timeline) {
      id
      name
      accountId
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AddTimelineMutationMutation extends Apollo.Mutation<
  AddTimelineMutation,
  AddTimelineMutationVariables
> {
  override document = AddTimelineMutationDocument;
  override client = 'default';
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
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SaveExistTimelineEventDocument = gql`
  mutation SaveExistTimelineEvent($event: ExistTimelineEventInput!) {
    event: editEvent(event: $event) {
      ...TimelineEvent
    }
  }
  ${TimelineEvent}
`;

@Injectable({
  providedIn: 'root',
})
export class SaveExistTimelineEventMutation extends Apollo.Mutation<
  SaveExistTimelineEvent,
  SaveExistTimelineEventVariables
> {
  override document = SaveExistTimelineEventDocument;
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteEventDocument = gql`
  mutation DeleteEvent($eventId: Int!) {
    deleteEvent(eventId: $eventId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteEventMutation extends Apollo.Mutation<
  DeleteEvent,
  DeleteEventVariables
> {
  override document = DeleteEventDocument;
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SaveAccountSettingsDocument = gql`
  mutation SaveAccountSettings(
    $accountId: Int!
    $settings: [AccountSettingInput]!
  ) {
    saveSettings(accountId: $accountId, settings: $settings)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SaveAccountSettingsMutation extends Apollo.Mutation<
  SaveAccountSettings,
  SaveAccountSettingsVariables
> {
  override document = SaveAccountSettingsDocument;
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SaveAccountDocument = gql`
  mutation SaveAccount($accountId: Int!, $account: SaveAccountInput!) {
    account: saveAccount(accountId: $accountId, account: $account) {
      ...ShortAccount
    }
  }
  ${ShortAccount}
`;

@Injectable({
  providedIn: 'root',
})
export class SaveAccountMutation extends Apollo.Mutation<
  SaveAccount,
  SaveAccountVariables
> {
  override document = SaveAccountDocument;
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AddAccountDocument = gql`
  mutation AddAccount($name: String!) {
    account: addAccount(name: $name) {
      ...ShortAccount
    }
  }
  ${ShortAccount}
`;

@Injectable({
  providedIn: 'root',
})
export class AddAccountMutation extends Apollo.Mutation<
  AddAccount,
  AddAccountVariables
> {
  override document = AddAccountDocument;
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventsDocument = gql`
  query GetEvents($timelineId: Int!, $accountId: Int, $cursor: String) {
    events: timelineCursorEvents(
      timelineId: $timelineId
      accountId: $accountId
      cursor: $cursor
      limit: { from: 0, to: 10 }
    ) {
      ...TimelineEvents
    }
  }
  ${TimelineEvents}
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventsQuery extends Apollo.Query<
  GetEvents,
  GetEventsVariables
> {
  override document = GetEventsDocument;
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetAccountTimelinesDocument = gql`
  query GetAccountTimelines($accountId: Int!) {
    timelines: myAccountTimelines(accountId: $accountId) {
      ...ShortTimeline
    }
  }
  ${ShortTimeline}
`;

@Injectable({
  providedIn: 'root',
})
export class GetAccountTimelinesQuery extends Apollo.Query<
  GetAccountTimelines,
  GetAccountTimelinesVariables
> {
  override document = GetAccountTimelinesDocument;
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTimelineDocument = gql`
  query GetTimeline($timelineId: Int!) {
    timeline: timeline(timelineId: $timelineId) {
      ...Timeline
    }
  }
  ${Timeline}
`;

@Injectable({
  providedIn: 'root',
})
export class GetTimelineQuery extends Apollo.Query<
  GetTimeline,
  GetTimelineVariables
> {
  override document = GetTimelineDocument;
  override client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetEventDocument = gql`
  query GetEvent($eventId: Int!, $accountId: Int) {
    event(eventId: $eventId, accountId: $accountId) {
      ...TimelineEvent
      timeline {
        ...Timeline
        account {
          ...ShortAccount
        }
      }
    }
  }
  ${TimelineEvent}
  ${Timeline}
  ${ShortAccount}
`;

@Injectable({
  providedIn: 'root',
})
export class GetEventQuery extends Apollo.Query<GetEvent, GetEventVariables> {
  override document = GetEventDocument;
  override client = 'default';
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
    private saveExistTimelineEventMutation: SaveExistTimelineEventMutation,
    private deleteEventMutation: DeleteEventMutation,
    private saveAccountSettingsMutation: SaveAccountSettingsMutation,
    private saveAccountMutation: SaveAccountMutation,
    private addAccountMutation: AddAccountMutation,
    private getEventsQuery: GetEventsQuery,
    private getAccountTimelinesQuery: GetAccountTimelinesQuery,
    private getTimelineQuery: GetTimelineQuery,
    private getEventQuery: GetEventQuery
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

  saveExistTimelineEvent(
    variables: SaveExistTimelineEventVariables,
    options?: MutationOptionsAlone<
      SaveExistTimelineEvent,
      SaveExistTimelineEventVariables
    >
  ) {
    return this.saveExistTimelineEventMutation.mutate(variables, options);
  }

  deleteEvent(
    variables: DeleteEventVariables,
    options?: MutationOptionsAlone<DeleteEvent, DeleteEventVariables>
  ) {
    return this.deleteEventMutation.mutate(variables, options);
  }

  saveAccountSettings(
    variables: SaveAccountSettingsVariables,
    options?: MutationOptionsAlone<
      SaveAccountSettings,
      SaveAccountSettingsVariables
    >
  ) {
    return this.saveAccountSettingsMutation.mutate(variables, options);
  }

  saveAccount(
    variables: SaveAccountVariables,
    options?: MutationOptionsAlone<SaveAccount, SaveAccountVariables>
  ) {
    return this.saveAccountMutation.mutate(variables, options);
  }

  addAccount(
    variables: AddAccountVariables,
    options?: MutationOptionsAlone<AddAccount, AddAccountVariables>
  ) {
    return this.addAccountMutation.mutate(variables, options);
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

  getAccountTimelines(
    variables: GetAccountTimelinesVariables,
    options?: QueryOptionsAlone<GetAccountTimelinesVariables>
  ) {
    return this.getAccountTimelinesQuery.fetch(variables, options);
  }

  getAccountTimelinesWatch(
    variables: GetAccountTimelinesVariables,
    options?: WatchQueryOptionsAlone<GetAccountTimelinesVariables>
  ) {
    return this.getAccountTimelinesQuery.watch(variables, options);
  }

  getTimeline(
    variables: GetTimelineVariables,
    options?: QueryOptionsAlone<GetTimelineVariables>
  ) {
    return this.getTimelineQuery.fetch(variables, options);
  }

  getTimelineWatch(
    variables: GetTimelineVariables,
    options?: WatchQueryOptionsAlone<GetTimelineVariables>
  ) {
    return this.getTimelineQuery.watch(variables, options);
  }

  getEvent(
    variables: GetEventVariables,
    options?: QueryOptionsAlone<GetEventVariables>
  ) {
    return this.getEventQuery.fetch(variables, options);
  }

  getEventWatch(
    variables: GetEventVariables,
    options?: WatchQueryOptionsAlone<GetEventVariables>
  ) {
    return this.getEventQuery.watch(variables, options);
  }
}
