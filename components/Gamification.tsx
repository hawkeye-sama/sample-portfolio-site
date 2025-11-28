
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Terminal, Zap, Eye, CheckCircle2, Lock, Unlock, X, Palette, MousePointer2, BookOpen } from 'lucide-react';
import { playAchievement, resumeAudioContext, playClick } from '../utils/audio';

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

interface Reward {
    id: string;
    type: 'theme' | 'cursor' | 'guide';
    label: string;
    description: string;
    levelReq: number;
    payload?: any; // e.g. theme colors
}

const REWARDS: Reward[] = [
    {
        id: 'theme_neon_blue',
        type: 'theme',
        label: 'NEON BLUE THEME',
        description: 'Change system primary color to Cyan.',
        levelReq: 2,
        payload: { primary: '#00f3ff', secondary: '#0066ff' }
    },
    {
        id: 'cursor_plasma',
        type: 'cursor',
        label: 'PLASMA CURSOR',
        description: 'Upgrade pointer device with high-energy plasma.',
        levelReq: 3
    },
    {
        id: 'secrets_guide',
        type: 'guide',
        label: 'SECRETS GUIDE',
        description: 'Unlock "guide" command in terminal to reveal all system secrets.',
        levelReq: 5
    }
];

// Persistent State Interface
interface PlayerState {
    xp: number;
    level: number;
    unlocked: AchievementId[];
    equippedTheme: string;
    equippedCursor: string;
}

// Global accessor for Terminal
export const getPlayerStats = (): PlayerState => {
    if (typeof window === 'undefined') return { xp: 0, level: 1, unlocked: [], equippedTheme: 'default', equippedCursor: 'default' };
    const stored = localStorage.getItem('player_state');
    return stored ? JSON.parse(stored) : { xp: 0, level: 1, unlocked: [], equippedTheme: 'default', equippedCursor: 'default' };
};

const Gamification: React.FC = () => {
  const [state, setState] = useState<PlayerState>({
      xp: 0,
      level: 1,
      unlocked: [],
      equippedTheme: 'default',
      equippedCursor: 'default'
  });
  
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Initialize & Load
  useEffect(() => {
    const stored = localStorage.getItem('player_state');
    if (stored) {
      const parsed = JSON.parse(stored);
      setState(parsed);
      applyTheme(parsed.equippedTheme);
      applyCursor(parsed.equippedCursor);
    } else {
      setTimeout(() => unlock('FIRST_VISIT'), 2000);
    }

    const handleUnlock = (e: CustomEvent) => {
        unlock(e.detail as AchievementId);
    };

    const handleToggleDashboard = () => {
        setShowDashboard(prev => !prev);
    };

    window.addEventListener('unlock-achievement' as any, handleUnlock);
    window.addEventListener('toggle-gamification-dashboard', handleToggleDashboard);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'p' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
            setShowDashboard(prev => !prev);
        }
    });
    
    // Add audio context resume on click
    window.addEventListener('click', resumeAudioContext, { once: true });

    return () => {
        window.removeEventListener('unlock-achievement' as any, handleUnlock);
        window.removeEventListener('toggle-gamification-dashboard', handleToggleDashboard);
    };
  }, []);

  useEffect(() => {
      localStorage.setItem('player_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
     if (queue.length > 0 && !currentNotification) {
         const next = queue[0];
         setCurrentNotification(next);
         playAchievement();
         setQueue(prev => prev.slice(1));
         setTimeout(() => setCurrentNotification(null), 4000);
     }
  }, [queue, currentNotification]);

  const unlock = (id: AchievementId) => {
    setState(prev => {
        if (prev.unlocked.includes(id)) return prev;
        
        const achievement = ACHIEVEMENTS[id];
        if (achievement) {
             setQueue(q => [...q, achievement]);
             const newUnlocked = [...prev.unlocked, id];
             const newXP = prev.xp + achievement.xp;
             // Simple Level Formula: Level = 1 + floor(xp / 500)
             const newLevel = 1 + Math.floor(newXP / 500);

             if (newLevel > prev.level) {
                 playAchievement(); // Level up sound
                 // Could queue a "Level Up" notification too
             }

             return { ...prev, unlocked: newUnlocked, xp: newXP, level: newLevel };
        }
        return prev;
    });
  };

  const applyTheme = (themeId: string) => {
      if (themeId === 'default') {
          document.documentElement.style.setProperty('--color-primary', '#ccff00');
          document.documentElement.style.setProperty('--color-secondary', '#7000df');
      } else if (themeId === 'theme_neon_blue') {
          const reward = REWARDS.find(r => r.id === 'theme_neon_blue');
          if (reward?.payload) {
              document.documentElement.style.setProperty('--color-primary', reward.payload.primary);
              document.documentElement.style.setProperty('--color-secondary', reward.payload.secondary);
          }
      }
  };

  const applyCursor = (cursorId: string) => {
      window.dispatchEvent(new CustomEvent('equip-cursor', { detail: cursorId }));
  };

  const equip = (reward: Reward) => {
      if (state.level < reward.levelReq) return;
      playClick();

      if (reward.type === 'theme') {
          const isEquipped = state.equippedTheme === reward.id;
          const newTheme = isEquipped ? 'default' : reward.id;
          setState(prev => ({ ...prev, equippedTheme: newTheme }));
          applyTheme(newTheme);
      } else if (reward.type === 'cursor') {
          const isEquipped = state.equippedCursor === reward.id;
          const newCursor = isEquipped ? 'default' : reward.id;
          setState(prev => ({ ...prev, equippedCursor: newCursor }));
          applyCursor(newCursor);
      }
  };

  const xpToNext = 500 - (state.xp % 500);
  const progressPercent = ((500 - xpToNext) / 500) * 100;

  return (
    <>
        {/* Notification Toast */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
            <AnimatePresence mode="wait">
                {currentNotification && (
                    <motion.div
                        initial={{ y: -100, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -50, opacity: 0, scale: 0.8 }}
                        className="bg-black/90 border border-primary px-6 py-4 rounded-lg shadow-[0_0_30px_rgba(204,255,0,0.3)] flex items-center gap-4 min-w-[320px] backdrop-blur-md relative overflow-hidden"
                    >
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(204,255,0,0.1)_50%,transparent_100%)] animate-scanline"></div>
                        <div className="p-2 bg-primary/20 rounded-full border border-primary">
                            <currentNotification.icon size={24} className="text-primary" />
                        </div>
                        <div>
                            <div className="text-primary font-mono text-xs font-bold tracking-widest uppercase mb-1">Achievement Unlocked</div>
                            <div className="text-white font-display font-bold text-lg leading-none">{currentNotification.title}</div>
                            <div className="text-gray-400 text-xs font-mono mt-1">{currentNotification.description}</div>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary animate-pulse"></div>
                        <div className="absolute top-2 right-2 text-primary font-mono text-[10px] opacity-50">+{currentNotification.xp}XP</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Dashboard Modal */}
        <AnimatePresence>
            {showDashboard && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDashboard(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#0a0a0a] border border-gray-800 w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl relative flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-gradient-to-r from-primary/10 to-transparent">
                            <div>
                                <h2 className="text-3xl font-display font-bold text-white mb-2">PLAYER PROFILE</h2>
                                <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
                                    <span>LEVEL {state.level}</span>
                                    <span className="text-primary">{state.xp} XP</span>
                                </div>
                            </div>
                            <button onClick={() => setShowDashboard(false)} className="text-gray-400 hover:text-white p-2">
                                <X size={24} />
                            </button>
                        </div>

                        {/* XP Bar */}
                        <div className="h-1 bg-gray-800 w-full">
                            <motion.div 
                                className="h-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            
                            {/* Unlocks / Rewards Section */}
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Trophy size={20} className="text-primary" /> UNLOCKS & REWARDS
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {REWARDS.map(reward => {
                                        const isUnlocked = state.level >= reward.levelReq;
                                        const isEquipped = (reward.type === 'theme' && state.equippedTheme === reward.id) ||
                                                           (reward.type === 'cursor' && state.equippedCursor === reward.id);
                                        
                                        return (
                                            <div key={reward.id} className={`p-4 border rounded-xl relative overflow-hidden transition-all ${isUnlocked ? 'border-primary/30 bg-primary/5' : 'border-gray-800 bg-black/50 opacity-50'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-mono bg-black/50 px-2 py-0.5 rounded text-gray-400">LVL {reward.levelReq}</span>
                                                    {isUnlocked ? <Unlock size={14} className="text-primary" /> : <Lock size={14} className="text-gray-600" />}
                                                </div>
                                                <h4 className="text-white font-bold mb-1">{reward.label}</h4>
                                                <p className="text-gray-400 text-xs mb-4">{reward.description}</p>
                                                
                                                {isUnlocked ? (
                                                    reward.type !== 'guide' ? (
                                                        <button 
                                                            onClick={() => equip(reward)}
                                                            className={`w-full py-2 text-xs font-bold rounded uppercase tracking-wider transition-colors ${
                                                                isEquipped ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                            }`}
                                                        >
                                                            {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                                                        </button>
                                                    ) : (
                                                        <div className="text-xs text-primary font-mono text-center border border-primary/20 py-2 rounded">
                                                            USE COMMAND 'guide'
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="w-full py-2 text-xs font-bold text-center text-gray-600 bg-gray-900 rounded cursor-not-allowed">
                                                        LOCKED
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Achievements List */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <CheckCircle2 size={20} className="text-primary" /> ACHIEVEMENTS
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {Object.values(ACHIEVEMENTS).map((ach) => {
                                        const unlocked = state.unlocked.includes(ach.id);
                                        return (
                                            <div key={ach.id} className={`flex items-center gap-4 p-4 rounded-lg border ${unlocked ? 'border-gray-700 bg-white/5' : 'border-gray-900 bg-black/20'}`}>
                                                <div className={`p-3 rounded-full ${unlocked ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-600'}`}>
                                                    <ach.icon size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`font-bold ${unlocked ? 'text-white' : 'text-gray-600'}`}>{ach.title}</h4>
                                                    <p className="text-sm text-gray-500">{ach.description}</p>
                                                </div>
                                                <div className="text-xs font-mono text-gray-500">
                                                    +{ach.xp} XP
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </>
  );
};

// Helper for other components to trigger achievements
export const dispatchAchievement = (id: AchievementId) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unlock-achievement', { detail: id }));
    }
};

export const toggleGamificationDashboard = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('toggle-gamification-dashboard'));
    }
};

export default Gamification;
