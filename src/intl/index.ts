import { IntlShape } from '@formatjs/intl';
import Vue, { readonly, ref } from 'vue';
import { createIntl } from 'vue-intl';

import { ReadonlyRefInjectionKey } from '@/utils';

// List of locales. This must be ordered so that more precise items are earlier
// (i.e. 'en-US' before 'en') so that those will be matched first.
const LOCALES = ['de', 'en'];

export const IntlInitialized = ReadonlyRefInjectionKey<boolean>();

/**
 * Find the default locale the browser has requested.
 */
function getDefaultLocale(): string {
  // Get a list of preferred locales for the user and load messages for the
  // first one we have messages for.
  const requestedLocales: readonly string[] = Array.isArray(navigator.languages)
    ? navigator.languages
    : [navigator.language || 'en'];

  for (const localeChoice of requestedLocales) {
    // Find the first locale that is compatible with the request. This is why
    // it's important that the LOCALES constant is ordered as described above.
    const locale = LOCALES.find((l) => localeChoice.startsWith(l));
    if (locale !== undefined) {
      return locale;
    }
  }
  return 'en';
}

const intl: Vue.Plugin = {
  install(app) {
    const locale = getDefaultLocale();

    // Install the Vue plugin that comes with FormatJS. This will setup the
    // dollar-prefixed format functions (for use in templates) as well as
    // provide the intl object to child components.
    createIntl({
      locale,
      defaultLocale: 'en',
      messages: {},
    }).install?.(app);

    const intl: IntlShape | undefined = app.config.globalProperties.$intl;
    if (intl === undefined) {
      throw Error('Something went wrong while setting up intl settings.');
    }

    const intlInitialized = ref(false);
    app.provide(IntlInitialized, readonly(intlInitialized));

    // Load the requested locale once the app has been mounted. This is delayed
    // so the initial load is as fast as possible. The <App> component will only
    // render the actual application once this initialization has finished.
    app.mixin({
      async mounted() {
        const messages = await import(
          /* webpackChunkName: "locale-[request]" */ `./locale/${locale}.json`
        );
        Object.assign(intl.messages, messages.default);
        intlInitialized.value = true;
      },
    });
  },
};
export default intl;
