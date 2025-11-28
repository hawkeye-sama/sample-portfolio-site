
import React from 'react';
import { Terminal, Send } from 'lucide-react';
import { playHover, playClick } from '../utils/audio';
import { dispatchAchievement } from './Gamification';
import AudioVisualizer from './AudioVisualizer';

const Contact: React.FC = () => {
  
  const handleContactClick = () => {
      playClick();
      dispatchAchievement('CONTACT_INIT');
  };

  return (
    <section id="contact" className="py-32 bg-[#050505] relative border-t border-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="mb-12 text-center">
            <h2 className="font-display text-4xl md:text-6xl text-white mb-4">INITIATE <span className="text-[#7000df]">UPLINK</span></h2>
            <p className="font-mono text-gray-500">SECURE CHANNEL OPEN. AWAITING TRANSMISSION.</p>
        </div>

        <div className="bg-[#0f0f0f] border border-gray-800 p-2 clip-corner">
            <div className="bg-black border border-gray-800 p-8 min-h-[300px] font-mono text-sm relative overflow-hidden">
                {/* Scanline */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                
                <div className="text-gray-400 mb-6">
                    <p>{'>'} CONNECTING TO SERVER...</p>
                    <p>{'>'} CONNECTION ESTABLISHED.</p>
                    <p>{'>'} USER: GUEST</p>
                    <p className="text-[#ccff00]">{'>'} CHOOSE PROTOCOL:</p>
                </div>

                <div className="grid gap-4">
                    <a 
                        href="mailto:bahroze1@hotmail.com" 
                        onClick={handleContactClick}
                        onMouseEnter={playHover}
                        className="group flex items-center gap-3 text-white hover:text-[#ccff00] transition-colors"
                    >
                        <span className="text-gray-600 group-hover:text-[#ccff00]">[1]</span>
                        <span>SEND_EMAIL_TRANSMISSION</span>
                        <Send size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    
                    <a 
                        href="https://calendly.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={handleContactClick}
                        onMouseEnter={playHover}
                        className="group flex items-center gap-3 text-white hover:text-[#ccff00] transition-colors"
                    >
                        <span className="text-gray-600 group-hover:text-[#ccff00]">[2]</span>
                        <span>SCHEDULE_SYNC_MEETING</span>
                    </a>
                </div>

                <div className="mt-12 flex gap-2 items-center">
                    <span className="text-[#ccff00]">guest@bahroze:~$</span>
                    <span className="w-2 h-4 bg-[#ccff00] animate-pulse"></span>
                </div>
            </div>
        </div>

        <footer className="mt-20 flex justify-between items-center font-mono text-xs text-gray-600 border-t border-gray-900 pt-8">
            <div className="flex flex-col gap-2">
                <div>© 2024 BAHROZE. SYSTEM V.3.1</div>
                <div className="flex gap-4">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#ccff00]" onMouseEnter={playHover}>GITHUB</a>
                    <a href="https://www.linkedin.com/in/bahroze-ali/" target="_blank" rel="noreferrer" className="hover:text-[#ccff00]" onMouseEnter={playHover}>LINKEDIN</a>
                </div>
            </div>
            
            <div className="hidden md:block">
                <AudioVisualizer />
            </div>
        </footer>

      </div>
    </section>
  );
};

export default Contact;
