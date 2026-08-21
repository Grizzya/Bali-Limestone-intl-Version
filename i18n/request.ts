import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';


import enMessages from './messages/en.json';
import idMessages from './messages/id.json';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages = locale === 'id' ? idMessages : enMessages;

  return {
    locale,
    messages
  };
});