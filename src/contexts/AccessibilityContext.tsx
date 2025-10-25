import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

type AccessibilityContextType = {
  highContrast: boolean;
  toggleHighContrast: () => void;
  voiceEnabled: boolean;
  toggleVoice: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  speak: (text: string) => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('highContrast');
    return saved === 'true';
  });

  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('voiceEnabled');
    return saved === 'true';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('voiceEnabled', String(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleVoice = () => setVoiceEnabled(!voiceEnabled);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const value = {
    highContrast,
    toggleHighContrast,
    voiceEnabled,
    toggleVoice,
    language,
    setLanguage,
    speak,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
