import messagesEs from '../../messages/es.json';
import messagesEn from '../../messages/en.json';

type Locale = 'en' | 'es';

const messages: Record<Locale, typeof messagesEn> = {
  en: messagesEn,
  es: messagesEs,
};

export const getTranslation = (key: string, locale: Locale = 'en'): string => {
  const keys = key.split('.');
  let value: any = messages[locale];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};

export const getLayerDefaultName = (locale: Locale = 'en'): string => {
  return getTranslation('layers.defaultName', locale);
};
