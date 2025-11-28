
import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Radio, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleMute, getMuteState, playClick, playAchievement } from '../utils/audio';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const [muted, setMuted] = useState(getMuteState());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    const timer = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(timer);
  }, []);

  const handleMuteToggle = () => {
      const newState = toggleMute();
      setMuted(newState);
      if (!newState) playClick();
  };

  const navLinks = [
    { name: 'PROJECTS', href: '#projects', num: '01' },
    { name: 'SKILLS', href: '#skills', num: '02' },
    { name: 'LOGS', href: '#blog', num: '03' },
  ];
  
  const handleSecretClick = () => {
      playAchievement();
      alert("System Hint: The terminal password protocol is 'PROTOCOL_OMEGA'");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-6 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between border-b border-[#ccff00]/30 bg-black/80 backdrop-blur-md pb-4 pt-2 px-4 clip-corner-tl">
          
          {/* Brand / Status */}
          <div className="flex items-center gap-4">
             <a href="#home" className="font-display font-bold text-2xl text-white tracking-wider flex items-center gap-2 group">
               <span className="text-[#ccff00] group-hover:animate-pulse">BAHROZE</span>
               <span 
                 className="text-xs font-mono text-gray-500 bg-white/10 px-2 py-0.5 rounded-sm cursor-help hover:bg-[#ccff00] hover:text-black transition-colors"
                 onClick={(e) => { e.preventDefault(); handleSecretClick(); }}
               >
                 V.3.1
               </span>
             </a>
             <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#ccff00]">
                <Radio size={14} className="animate-pulse" />
                <span>SYS.ONLINE</span>
             </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="font-mono text-sm text-gray-400 hover:text-[#ccff00] transition-colors relative group flex items-center gap-2"
              >
                <span className="text-xs text-[#7000df] opacity-50 group-hover:opacity-100">[{link.num}]</span>
                {link.name}
              </a>
            ))}
             <div className="h-4 w-px bg-gray-800"></div>
             
             {/* Sound Toggle */}
             <button onClick={handleMuteToggle} className="text-gray-400 hover:text-[#ccff00] transition-colors">
                 {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
             </button>

             <div className="h-4 w-px bg-gray-800"></div>
             <div className="font-mono text-xs text-gray-500">{time} UTC</div>
          </div>

          <div className="hidden md:flex items-center">
             <a 
               href="#contact" 
               className="bg-[#ccff00] text-black font-bold font-mono text-sm px-6 py-2 cyber-button hover:bg-white transition-colors"
             >
              INIT_CONTACT
             </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={handleMuteToggle} className="text-gray-400 hover:text-[#ccff00] transition-colors">
                 {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
             <button 
                className="text-[#ccff00]"
                onClick={() => setMobileMenuOpen(true)}
            >
                <Terminal size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black border-l border-[#ccff00]/20 flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
                <span className="font-display text-xl text-white">MENU</span>
                <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-[#ccff00]"
                >
                <X size={32} />
                </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-4xl text-transparent text-stroke hover:text-[#ccff00] hover:text-stroke-0 transition-all uppercase"
                  style={{ WebkitTextStroke: '1px white' }}
                >
                  {link.name}
                </a>
              ))}
               <a 
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-8 font-mono text-[#ccff00] border border-[#ccff00] px-4 py-3 text-center"
                >
                  EXECUTE CONTACT_PROTOCOL
                </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
