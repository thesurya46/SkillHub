import { useEffect, useRef } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

type VoiceCommandCallback = (command: string) => void;

export const useVoiceCommands = (onCommand: VoiceCommandCallback) => {
  const { voiceEnabled, speak } = useAccessibility();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!voiceEnabled || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase().trim();

      console.log('Voice command:', command);

      if (command.includes('go to profile') || command.includes('open profile')) {
        onCommand('profile');
        speak('Opening profile');
      } else if (command.includes('go to skills') || command.includes('my skills')) {
        onCommand('myskills');
        speak('Opening my skills');
      } else if (command.includes('go to bookings') || command.includes('open bookings')) {
        onCommand('bookings');
        speak('Opening bookings');
      } else if (command.includes('go to community') || command.includes('community projects')) {
        onCommand('projects');
        speak('Opening community projects');
      } else if (command.includes('go to credits') || command.includes('open credits')) {
        onCommand('credits');
        speak('Opening credits');
      } else if (command.includes('explore') || command.includes('search skills')) {
        onCommand('explore');
        speak('Opening explore skills');
      } else if (command.includes('settings') || command.includes('accessibility')) {
        onCommand('settings');
        speak('Opening settings');
      } else if (command.includes('help')) {
        speak('Voice commands available. Say go to followed by: profile, skills, bookings, community, or credits. Say search to find skills. Say settings for accessibility options.');
      } else if (command.includes('search')) {
        const searchTerm = command.replace('search', '').trim();
        if (searchTerm) {
          onCommand(`search:${searchTerm}`);
          speak(`Searching for ${searchTerm}`);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      if (voiceEnabled) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceEnabled, onCommand, speak]);

  return { recognition: recognitionRef.current };
};
