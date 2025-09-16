import {
  AcceptLanguageResolver,
  QueryResolver,
  I18nOptions,
} from 'nestjs-i18n';
import * as path from 'path';

export const createI18nConfig = (): I18nOptions => {
  return {
    fallbackLanguage: 'zh-HK',
    loaderOptions: {
      path: path.join(__dirname, '../i18n/'),
      watch: true,
    },
    resolvers: [
      { use: QueryResolver, options: ['lang'] },
      AcceptLanguageResolver,
    ],
  };
};
