import { createIntl, createIntlCache, IntlShape } from '@formatjs/intl';
import { onBeforeMount, readonly, Ref, ref } from 'vue';
import { provideIntl } from 'vue-intl';

// List of locales. This must be ordered so that more precise items are earlier
// (i.e. 'en-US' before 'en') so that those will be matched first.
const LOCALES = ['de', 'en'];

interface InitializeIntlReturn {
  intl: IntlShape<string>;
  loadedLocale: Ref<Readonly<string | undefined>>;
}

/**
 * Create an Intl object and provide it to child components.
 *
 * This will try to load the default locale from the browser into it as well,
 * if it is available. For this purpose the returned objects contains a ref
 * `loadedLocale`, which should be used to check if strings have already been
 * loaded. The base App component that invokes this function should not render
 * any children that rely on Internationalization until this has a
 * non-undefined value.
 */
export function initializeIntl(): InitializeIntlReturn {
  // Get a list of preferred locales for the user and load messages for the
  // first one we have messages for.
  const requestedLocales: readonly string[] = Array.isArray(navigator.languages)
    ? navigator.languages
    : [navigator.language || 'en'];
  let locale: string | undefined = undefined;
  for (const localeChoice of requestedLocales) {
    // Find the first locale that is compatible with the request. This is why
    // it's important that the LOCALES constant is ordered as described above.
    locale = LOCALES.find((l) => localeChoice.startsWith(l));
    if (locale !== undefined) {
      break;
    }
  }
  if (locale === undefined) {
    locale = 'en';
  }

  const cache = createIntlCache();
  const intl = createIntl(
    {
      locale,
      defaultLocale: 'en',
      messages: {},
    },
    cache
  );
  provideIntl(intl);

  const loadedLocale = ref<string>();
  onBeforeMount(async () => {
    const messages = await import(
      /* webpackChunkName: "locale-[request]" */ `./locale/${locale}.json`
    );
    Object.assign(intl.messages, messages.default);
    loadedLocale.value = locale;
  });

  return { intl, loadedLocale: readonly(loadedLocale) };
}
