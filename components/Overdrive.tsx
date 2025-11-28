
import React, { useEffect, useState } from 'react';
import { dispatchAchievement } from './Gamification';
import { playPowerUp } from '../utils/audio';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'b', 'a'
];

const Overdrive: React.FC = () => {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setInputSequence(prev => {
        const next = [...prev, e.key];
        if (next.length > KONAMI_CODE.length) {
          return next.slice(next.length - KONAMI_CODE.length);
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (inputSequence.join(',') === KONAMI_CODE.join(',')) {
      activateOverdrive();
      setInputSequence([]);
    }
  }, [inputSequence]);

  const activateOverdrive = () => {
    if (active) return;
    setActive(true);
    playPowerUp();
    dispatchAchievement('TERMINAL_HACKER'); // Or a specific GOD_MODE achievement
    
    // Inject CSS to override variables
    document.documentElement.style.setProperty('--color-primary', '#ff0000');
    document.documentElement.classList.add('overdrive-mode');

    // Create a temporary overlay effect
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-red-500 z-[9999] mix-blend-overlay pointer-events-none animate-ping';
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 1000);
  };

  if (!active) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-red-600 z-[9999] animate-pulse shadow-[0_0_20px_#ff0000]">
       <div className="absolute top-4 right-4 text-red-500 font-black font-display text-4xl animate-bounce">
           OVERDRIVE ENGAGED
       </div>
       <style>{`
         .overdrive-mode ::selection { background: red !important; color: black !important; }
         .overdrive-mode .text-\\[\\#ccff00\\] { color: #ff0000 !important; }
         .overdrive-mode .bg-\\[\\#ccff00\\] { background-color: #ff0000 !important; }
         .overdrive-mode .border-\\[\\#ccff00\\] { border-color: #ff0000 !important; }
         .overdrive-mode .hover\\:text-\\[\\#ccff00\\]:hover { color: #ff0000 !important; }
         .overdrive-mode .hover\\:bg-\\[\\#ccff00\\]:hover { background-color: #ff0000 !important; }
       `}</style>
    </div>
  );
};

export default Overdrive;
