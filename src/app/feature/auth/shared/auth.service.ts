import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { SharedActions } from '../../../shared/store/shared/shared.actions';

@Injectable({ providedIn: 'root' })
export class NewAuthService {
  private readonly store = inject(Store);
  private readonly oauthService = inject(OAuthService);

  private readonly isAuthenticatedSignal = signal(false);
  private readonly isDoneLoadingSignal = signal(false);

  public isAuthenticated$ = toObservable(this.isAuthenticatedSignal);
  public isDoneLoading$ = toObservable(this.isDoneLoadingSignal);
  public readonly redirectUrl = signal<string | null>(null);

  constructor() {
    // Useful for debugging:
    this.oauthService.events.subscribe(event => {
      if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent Object:', event);
      } else {
        console.warn('OAuthEvent Object:', event);
      }
    });

    // The following cross-tab communication of fresh access tokens works usually in practice,
    // but if you need more robust handling the community has come up with ways to extend logic
    // in the library which may give you better mileage.
    //
    // See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    //
    // Until then we'll stick to this:
    window.addEventListener('storage', event => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );

      this.isAuthenticatedSignal.set(this.oauthService.hasValidAccessToken());

      if (!this.oauthService.hasValidAccessToken()) {
        this.navigateToLoginPage();
      }
    });

    this.oauthService.events.subscribe(() => {
      this.isAuthenticatedSignal.set(this.oauthService.hasValidAccessToken());
    });
    this.isAuthenticatedSignal.set(this.oauthService.hasValidAccessToken());

    this.oauthService.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(() => this.oauthService.loadUserProfile());

    this.oauthService.events
      .pipe(
        filter(e =>
          [
            'session_terminated',
            'session_error',
            'token_validation_error',
          ].includes(e.type)
        )
      )
      .subscribe(() => this.navigateToLoginPage());

    this.oauthService.setupAutomaticSilentRefresh();
  }

  public runInitialLoginSequence(): Promise<void> {
    if (location.hash) {
      console.log('Encountered hash fragment, plotting as table...');
      console.table(
        location.hash
          .slice(1)
          .split('&')
          .map(kvp => kvp.split('='))
      );
    }

    // 0. LOAD CONFIG:
    // First we have to check to see how the IdServer is
    // currently configured:
    return (
      this.oauthService
        .loadDiscoveryDocument()

        // 1. HASH LOGIN:
        // Try to log in via hash fragment after redirect back
        // from IdServer from initImplicitFlow:
        .then(() => this.oauthService.tryLogin())

        .then(() => {
          if (this.oauthService.hasValidAccessToken()) {
            return Promise.resolve();
          }

          // 2. SILENT LOGIN:
          // Try to log in via a refresh because then we can prevent
          // needing to redirect the user:
          return this.oauthService
            .silentRefresh()
            .then(() => Promise.resolve())
            .catch(result => {
              // Subset of situations from https://openid.net/specs/openid-connect-core-1_0.html#AuthError
              // Only the ones where it's reasonably sure that sending the
              // user to the IdServer will help.
              const errorResponsesRequiringUserInteraction = [
                'interaction_required',
                'login_required',
                'account_selection_required',
                'consent_required',
              ];

              if (
                result &&
                result.reason &&
                errorResponsesRequiringUserInteraction.indexOf(
                  result.reason.error
                ) >= 0
              ) {
                // 3. ASK FOR LOGIN:
                // At this point we know for sure that we have to ask the
                // user to log in, so we redirect them to the IdServer to
                // enter credentials.
                //
                // Enable this to ALWAYS force a user to login.
                // this.login();
                //
                // Instead, we'll now do this:
                console.warn(
                  'User interaction is needed to log in, we will wait for the user to manually log in.'
                );
                return Promise.resolve();
              }

              // We can't handle the truth, just pass on the problem to the
              // next handler.
              return Promise.reject(result);
            });
        })

        .then(() => {
          this.isDoneLoadingSignal.set(true);

          // Check for the strings 'undefined' and 'null' just to be sure. Our current
          // login(...) should never have this, but in case someone ever calls
          // initImplicitFlow(undefined | null) this could happen.
          if (
            this.oauthService.state &&
            this.oauthService.state !== 'undefined' &&
            this.oauthService.state !== 'null'
          ) {
            let stateUrl = this.oauthService.state;
            if (stateUrl.startsWith('/') === false) {
              stateUrl = decodeURIComponent(stateUrl);
            }
            this.redirectUrl.set(stateUrl);
          }
        })
        .catch(() => this.isDoneLoadingSignal.set(true))
    );
  }

  public login(targetUrl?: string) {
    this.oauthService.initLoginFlow(targetUrl);
  }

  public logout() {
    this.oauthService.revokeTokenAndLogout().finally(() => {
      this.oauthService.logOut();
    });
  }
  public hasValidToken() {
    return this.oauthService.hasValidAccessToken();
  }

  private navigateToLoginPage() {
    this.store.dispatch(SharedActions.shouldLogin());
  }
}
