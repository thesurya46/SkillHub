import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const CREDITS_PER_MINUTE = 1;
const UPDATE_INTERVAL = 60000;

export const useActivityTracker = () => {
  const { user, profile, refreshProfile } = useAuth();
  const lastUpdateRef = useRef<number>(Date.now());
  const activeTimeRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);

  useEffect(() => {
    if (!user || !profile) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActiveRef.current = false;
      } else {
        isActiveRef.current = true;
        lastUpdateRef.current = Date.now();
      }
    };

    const handleActivity = () => {
      isActiveRef.current = true;
      lastUpdateRef.current = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    const interval = setInterval(async () => {
      if (!isActiveRef.current) return;

      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateRef.current;

      if (timeSinceLastUpdate < UPDATE_INTERVAL) {
        activeTimeRef.current += timeSinceLastUpdate;
      }

      if (activeTimeRef.current >= UPDATE_INTERVAL) {
        const minutesActive = Math.floor(activeTimeRef.current / UPDATE_INTERVAL);
        const creditsToAdd = minutesActive * CREDITS_PER_MINUTE;

        if (creditsToAdd > 0) {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({
                credits: profile.credits + creditsToAdd,
              })
              .eq('id', user.id);

            if (!error) {
              await refreshProfile();
              activeTimeRef.current = 0;
            }
          } catch (error) {
            console.error('Error updating credits:', error);
          }
        }
      }

      lastUpdateRef.current = now;
    }, UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [user, profile, refreshProfile]);
};
