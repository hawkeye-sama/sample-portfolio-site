
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Terminal, Zap, Eye, CheckCircle2 } from 'lucide-react';
import { playAchievement, resumeAudioContext } from '../utils/audio';

export type AchievementId = 'FIRST_VISIT' | 'TERMINAL_HACKER' | 'SCROLL_MASTER' | 'INSPECTOR_GADGET' | 'CONTACT_INIT';

interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: React.FC<any>;
  xp: number;
}

const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  FIRST_VISIT: {
    id: 'FIRST_VISIT',
    title: 'SYSTEM ENTRY',
    description: 'Successfully connected to the mainframe.',
    icon: CheckCircle2,
    xp: 100
  },
  TERMINAL_HACKER: {
    id: 'TERMINAL_HACKER',
    title: 'ROOT ACCESS',
    description: 'Executed a command in the terminal.',
    icon: Terminal,
    xp: 500
  },
  SCROLL_MASTER: {
    id: 'SCROLL_MASTER',
    title: 'DEEP DIVE',
    description: 'Explored the entire system archive.',
    icon: Zap,
    xp: 250
  },
  INSPECTOR_GADGET: {
    id: 'INSPECTOR_GADGET',
    title: 'DATA MINER',
    description: 'Detailed analysis of project files.',
    icon: Eye,
    xp: 300
  },
  CONTACT_INIT: {
    id: 'CONTACT_INIT',
    title: 'UPLINK ESTABLISHED',
    description: 'Initiated communication protocol.',
    icon: Trophy,
    xp: 1000
  }
};

const Gamification: React.FC = () => {
  const [unlocked, setUnlocked] = useState<AchievementId[]>([]);
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);

  useEffect(() => {
    // Check session storage for previous unlocks
    const stored = sessionStorage.getItem('achievements');
    if (stored) {
      setUnlocked(JSON.parse(stored));
    } else {
      // First visit unlock
      setTimeout(() => unlock('FIRST_VISIT'), 2000);
    }

    const handleUnlock = (e: CustomEvent) => {
        unlock(e.detail as AchievementId);
    };

    window.addEventListener('unlock-achievement' as any, handleUnlock);
    
    // Add audio context resume on click
    window.addEventListener('click', resumeAudioContext, { once: true });

    return () => {
        window.removeEventListener('unlock-achievement' as any, handleUnlock);
    };
  }, []);

  useEffect(() => {
     if (queue.length > 0 && !currentNotification) {
         const next = queue[0];
         setCurrentNotification(next);
         playAchievement();
         setQueue(prev => prev.slice(1));
         
         // Auto dismiss
         setTimeout(() => {
             setCurrentNotification(null);
         }, 4000);
     }
  }, [queue, currentNotification]);

  const unlock = (id: AchievementId) => {
    setUnlocked(prev => {
        if (prev.includes(id)) return prev;
        
        const achievement = ACHIEVEMENTS[id];
        if (achievement) {
             setQueue(q => [...q, achievement]);
             const newUnlocked = [...prev, id];
             sessionStorage.setItem('achievements', JSON.stringify(newUnlocked));
             return newUnlocked;
        }
        return prev;
    });
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
       <AnimatePresence mode="wait">
          {currentNotification && (
              <motion.div
                initial={{ y: -100, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -50, opacity: 0, scale: 0.8 }}
                className="bg-black/90 border border-[#ccff00] px-6 py-4 rounded-lg shadow-[0_0_30px_rgba(204,255,0,0.3)] flex items-center gap-4 min-w-[320px] backdrop-blur-md relative overflow-hidden"
              >
                  {/* Scanline */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(204,255,0,0.1)_50%,transparent_100%)] animate-scanline"></div>
                  
                  <div className="p-2 bg-[#ccff00]/20 rounded-full border border-[#ccff00]">
                      <currentNotification.icon size={24} className="text-[#ccff00]" />
                  </div>
                  
                  <div>
                      <div className="text-[#ccff00] font-mono text-xs font-bold tracking-widest uppercase mb-1">Achievement Unlocked</div>
                      <div className="text-white font-display font-bold text-lg leading-none">{currentNotification.title}</div>
                      <div className="text-gray-400 text-xs font-mono mt-1">{currentNotification.description}</div>
                  </div>

                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#ccff00] animate-pulse"></div>
                  
                  <div className="absolute top-2 right-2 text-[#ccff00] font-mono text-[10px] opacity-50">
                      +{currentNotification.xp}XP
                  </div>
              </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};

// Helper for other components to trigger achievements
export const dispatchAchievement = (id: AchievementId) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unlock-achievement', { detail: id }));
    }
};

export default Gamification;
