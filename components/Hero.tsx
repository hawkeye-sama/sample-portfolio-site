
import React, { useRef, useState, useEffect } from 'react';
import { HERO_DESCRIPTION, PROFILE_IMAGE_URL } from '../constants';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu, ChevronDown, Radio } from 'lucide-react';
import { playHover, playClick, playWarp } from '../utils/audio';
import { triggerWarp } from './WarpTransition';
import MagneticWrapper from './MagneticWrapper';
import DecryptText from './DecryptText';

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

const ScrambleText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const scramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((letter, index) => {
            if (index < iteration) return text[index];
            return LETTERS[Math.floor(Math.random() * LETTERS.length)];
          }).join("")
      );
      if (iteration >= text.length) if (intervalRef.current) clearInterval(intervalRef.current);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <motion.span onHoverStart={scramble} className={className}>{displayText}</motion.span>
  );
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  
  // Parallax Effects
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleTerminalClick = (e: React.MouseEvent) => {
      e.preventDefault();
      playClick();
      playWarp();
      triggerWarp();
      setTimeout(() => {
          const terminal = document.getElementById('terminal');
          terminal?.scrollIntoView({ behavior: 'smooth' });
      }, 500); // Wait for warp effect to build up
  };

  return (
    <section ref={containerRef} id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden perspective-1000">
      
      {/* HUD Elements */}
      <div className="absolute top-1/4 left-10 hidden lg:block opacity-50">
        <div className="w-px h-32 bg-[#ccff00] mb-2"></div>
        <div className="font-mono text-[10px] text-[#ccff00] writing-vertical-lr tracking-widest">SYSTEM_READY</div>
      </div>
      <div className="absolute bottom-1/4 right-10 hidden lg:block opacity-50 text-right">
        <div className="font-mono text-[10px] text-[#ccff00] tracking-widest mb-2">COORD: 34.0522° N</div>
        <div className="w-32 h-px bg-[#ccff00] ml-auto"></div>
      </div>
      
      {/* Hidden Easter Egg Pixel */}
      <div 
        className="absolute bottom-10 right-10 w-2 h-2 cursor-help z-50 group"
        onClick={() => alert("SECRET FOUND: The Terminal is the key. Look for hidden files using 'ls -la'.")}
      >
        <div className="w-full h-full bg-transparent group-hover:bg-[#ccff00] animate-ping opacity-0 group-hover:opacity-100"></div>
      </div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div style={{ y: yText }} className="order-2 lg:order-1 relative">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-[#ccff00] animate-pulse"></div>
                <span className="font-mono text-[#ccff00] text-sm tracking-widest">IDENTITY_VERIFIED</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ccff00] to-[#7000df] bg-[length:200%_auto] animate-gradient-text leading-[0.85] mb-6 glitch-text" data-text="BAHROZE">
                BAHROZE
            </h1>
            
            <h2 className="text-xl md:text-2xl font-mono text-gray-400 mb-8 flex items-center gap-3">
                <span className="text-[#7000df]">&gt;</span>
                <ScrambleText text="FULL_STACK_ARCHITECT" />
            </h2>
            
            <p className="text-gray-400 max-w-xl text-lg mb-10 leading-relaxed font-light border-l-2 border-[#ccff00]/50 pl-6">
              {HERO_DESCRIPTION}
            </p>

            <div className="flex flex-wrap gap-4">
                <MagneticWrapper>
                  <a 
                      href="#terminal" 
                      onMouseEnter={playHover}
                      onClick={handleTerminalClick}
                      className="cyber-button bg-[#ccff00] text-black font-bold px-8 py-4 hover:bg-white transition-colors flex items-center gap-2 group relative overflow-hidden"
                  >
                      <span className="relative z-10 flex items-center gap-2"><Cpu size={18} /> INITIALIZE_TERMINAL</span>
                      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
                  </a>
                </MagneticWrapper>
                
                <MagneticWrapper>
                  <a 
                      href="#contact" 
                      onMouseEnter={playHover}
                      onClick={playClick}
                      className="cyber-button border border-white/20 text-white font-bold px-8 py-4 hover:bg-white/10 transition-colors backdrop-blur-sm block"
                  >
                      INIT_COMMS
                  </a>
                </MagneticWrapper>
            </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div style={{ y: yImage }} className="order-1 lg:order-2 flex justify-center relative">
             <div className="relative w-72 h-72 md:w-[500px] md:h-[500px]">
                {/* Decorative Rings */}
                <div className="absolute inset-0 border border-[#ccff00]/30 rounded-full animate-spin-slow"></div>
                <div className="absolute -inset-8 border border-[#7000df]/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                <div className="absolute -inset-20 border border-dashed border-white/10 rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
                
                {/* Image Container */}
                <div className="absolute inset-8 clip-corner overflow-hidden bg-gray-900 group">
                    <img 
                        src={PROFILE_IMAGE_URL} 
                        alt="Profile" 
                        className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                    />
                    {/* Glitch Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ccff00]/10 to-transparent animate-scanline pointer-events-none"></div>
                    
                    {/* Data Overlays */}
                    <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                       <span className="text-[10px] font-mono text-[#ccff00] bg-black/50 px-2 py-1 flex items-center gap-2">
                          <Radio size={10} className="animate-pulse"/> LIVE_FEED
                       </span>
                    </div>
                </div>
             </div>
        </motion.div>

      </motion.div>

      {/* Scroll Indicator */}
      <motion.a 
        href="#terminal"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#ccff00] flex flex-col items-center gap-2 opacity-50 hover:opacity-100 z-20 cursor-pointer"
        onMouseEnter={playHover}
        onClick={playClick}
      >
        <span className="font-mono text-[10px] tracking-widest">SCROLL_DOWN</span>
        <ChevronDown />
      </motion.a>
    </section>
  );
};

export default Hero;
