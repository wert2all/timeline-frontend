import { AfterViewInit, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CookieConsent from 'vanilla-cookieconsent';
import { ApplicationActions } from '../../store/application/application.actions';

@Component({
  standalone: true,
  selector: 'app-cookie-consent',
  template: ``,
})
export class CookieConsentComponent implements AfterViewInit {
  private readonly store = inject(Store);
  ngAfterViewInit(): void {
    CookieConsent.run({
      onConsent: ({ cookie }) => {
        this.store.dispatch(
          ApplicationActions.dispatchCookieConsent({ cookie })
        );
      },

      categories: {
        necessary: {
          enabled: true, // this category is enabled by default
          readOnly: true, // this category cannot be disabled
        },
        analytics: {},
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies',
              description:
                'Cookies are small text files that websites store on your device. They help application remember information about your visit, like your login details. This makes your browsing experience more convenient and personalized.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage Individual preferences',
              footer: `
                    <a class="link" href="/cookie-policy" target="_blank">Cookie Policy</a>
                    <a class="link" href="/privacy" target="_blank">Privacy Policy</a>
                `,
            },
            preferencesModal: {
              title: 'Manage cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Accept current selection',
              closeIconLabel: 'Close modal',
              serviceCounterLabel: 'Service|Services',
              sections: [
                {
                  title: 'Your Privacy Choices',
                  description: `In this panel you can express some preferences related to the processing of your personal information. You may review and change expressed choices at any time by resurfacing this panel via the provided link. To deny your consent to the specific processing activities described below, switch the toggles to off or use the “Reject all” button and confirm you want to save your choices.`,
                },
                {
                  title: 'Strictly Necessary',
                  description:
                    'These cookies are essential for the proper functioning of the website and cannot be disabled.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Performance and Analytics',
                  description:
                    'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    caption: 'Cookie table',
                    headers: {
                      name: 'Cookie',
                      domain: 'Domain',
                      desc: 'Description',
                    },
                    body: [
                      {
                        name: '_ga',
                        domain: window.location.hostname,
                        desc: 'Description 1',
                      },
                      {
                        name: '_gid',
                        domain: window.location.hostname,
                        desc: 'Description 2',
                      },
                    ],
                  },
                },
                {
                  title: 'Targeting and Advertising',
                  description:
                    'These cookies are used to make advertising messages more relevant to you and your interests. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.',
                  linkedCategory: 'ads',
                },
                {
                  title: 'More information',
                  description:
                    'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>',
                },
              ],
            },
          },
        },
      },
    });
  }
}
