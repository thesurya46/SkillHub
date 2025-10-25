import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from '../hooks/useTranslation';
import { Volume2, VolumeX, Mic, Info } from 'lucide-react';

export const AccessibilitySettings = () => {
  const { voiceEnabled, toggleVoice, speak } =
    useAccessibility();
  const { t } = useTranslation();

  const handleVoiceToggle = () => {
    const newState = !voiceEnabled;
    toggleVoice();
    if (newState) {
      setTimeout(() => speak('Voice navigation enabled'), 100);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('accessibility')}</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                {voiceEnabled ? (
                  <Volume2 size={20} className="text-green-600" />
                ) : (
                  <VolumeX size={20} className="text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('voiceNavigation')}</h3>
                <p className="text-sm text-gray-600">Navigate using voice commands</p>
              </div>
            </div>
            <button
              onClick={handleVoiceToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                voiceEnabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
              aria-label={`${voiceEnabled ? 'Disable' : 'Enable'} voice navigation`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  voiceEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {voiceEnabled && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-blue-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Mic size={16} />
                    {t('voiceCommands')}
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• {t('sayGoTo')}</li>
                    <li>• {t('saySearch')}</li>
                    <li>• {t('sayHelp')}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-sm p-6 text-white">
        <h3 className="font-semibold text-lg mb-2">Accessibility Features</h3>
        <ul className="text-sm space-y-1 text-blue-50">
          <li>✓ Screen reader compatible with ARIA labels</li>
          <li>✓ Keyboard navigation support</li>
          <li>✓ Focus indicators for all interactive elements</li>
          <li>✓ Respects reduced motion preferences</li>
          <li>✓ Semantic HTML structure</li>
        </ul>
      </div>
    </div>
  );
};
