import * as path from 'path';
import * as fs from 'fs';

import { extract } from '@formatjs/cli';
import glob from 'fast-glob';
import prettier from 'prettier';

const LOCALES = ['en', 'de'];

const baseDirectory = path.dirname(new URL(import.meta.url).pathname);

async function run() {
  console.info('Extracting messages from App source...');

  const extractionResults = await extract(
    [...glob.sync(path.join(baseDirectory, 'src', '**', '*.vue'))],
    {
      idInterpolationPattern: '[sha512:contenthash:base64:6]',
    }
  );
  const messages = JSON.parse(extractionResults);
  const messageIds = new Set(Object.keys(messages));

  if (typeof messages !== 'object') {
    console.error('Extraction did not yield an object.');
    return;
  }
  console.info(
    `Finished extraction. Found ${Object.keys(messages).length} message(s).`
  );

  console.info('Merging exsiting messages files...');

  for (const locale of LOCALES) {
    try {
      const localePath = path.join(baseDirectory, 'locale', `${locale}.json`);
      const existingLocale = fs.existsSync(localePath)
        ? JSON.parse(fs.readFileSync(localePath))
        : {};

      // Remove messages from the existing locale that are no longer present
      // in the application. Then merge the two message objects, while
      // prioritizing existing (and therefore already translated) messages.
      for (const key of Object.keys(existingLocale)) {
        if (!messageIds.has(key)) {
          delete existingLocale[key];
        }
      }
      const mergedLocale = { ...messages, ...existingLocale };

      // Set the original message for each item in the locale. This can be
      // helpful for translating. It will be ignored during compilation.
      for (const key of Object.keys(mergedLocale)) {
        mergedLocale[key].originalMessage = messages[key].defaultMessage;
      }

      // Write back the processed locale, formatted by prettier.
      const prettierConfig = await prettier.resolveConfig(localePath);
      const fileContent = await prettier.format(
        JSON.stringify(mergedLocale, null, 2),
        { ...prettierConfig, parser: 'json' }
      );
      fs.writeFileSync(localePath, fileContent);

      console.info(`Processed ${locale}.`);
    } catch (error) {
      console.error(`Error while processing ${locale}:`);
      console.error(error);
      return;
    }
  }
}

run();
