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

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
};

export type AuthorizeVariables = Exact<{ [key: string]: never }>;

export type Authorize = { profile?: User | null };

export const User = gql`
  fragment User on User {
    id
    name
    email
    avatar
  }
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

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface MutationOptionsAlone<T, V>
  extends Omit<ApolloCore.MutationOptions<T, V>, 'mutation' | 'variables'> {}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  constructor(private authorizeMutation: AuthorizeMutation) {}

  authorize(
    variables?: AuthorizeVariables,
    options?: MutationOptionsAlone<Authorize, AuthorizeVariables>
  ) {
    return this.authorizeMutation.mutate(variables, options);
  }
}
