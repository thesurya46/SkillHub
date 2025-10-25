import { useAccessibility } from '../contexts/AccessibilityContext';
import { getTranslation, TranslationKey } from '../lib/translations';

export const useTranslation = () => {
  const { language } = useAccessibility();

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  return { t, language };
};
