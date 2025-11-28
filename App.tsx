
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import CustomCursor from './components/CustomCursor';
import Background from './components/Background';
import InteractiveTerminal from './components/InteractiveTerminal';
import SystemMonitor from './components/SystemMonitor';
import Gamification, { dispatchAchievement } from './components/Gamification';
import Overdrive from './components/Overdrive';
import WarpTransition from './components/WarpTransition';
import CommandPalette from './components/CommandPalette';
import SystemWipe from './components/SystemWipe';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);

  useEffect(() => {
    // Fast Linux-style Boot Sequence
    const BOOT_LOGS = [
        "KERNEL: INITIALIZING...",
        "[ OK ] CPU 0 INITIALIZED",
        "[ OK ] CPU 1 INITIALIZED",
        "[ OK ] MEMORY CHECK: 64GB VERIFIED",
        "[ .... ] MOUNTING VIRTUAL FILE SYSTEM...",
        "[ OK ] MOUNTED /dev/sda1 (ROOT)",
        "[ .... ] LOADING NEURAL NETWORK MODULES...",
        "[ OK ] GEMINI-3-PRO: CONNECTED",
        "[ .... ] ESTABLISHING SECURE UPLINK...",
        "[ OK ] SSL HANDSHAKE COMPLETE",
        "[ OK ] STARTING INTERFACE RENDERER...",
        "[ OK ] SYSTEM READY"
    ];

    let delay = 0;
    const interval = 60; // Very fast lines (60ms)

    BOOT_LOGS.forEach((line, index) => {
        setTimeout(() => {
            setBootLines(prev => [...prev, line]);
        }, index * interval);
    });

    // End loading after sequence
    const totalTime = BOOT_LOGS.length * interval + 400; // Add small buffer at end
    const timer = setTimeout(() => setLoading(false), totalTime);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
     // Achievement for scrolling to bottom
     const handleScroll = () => {
         if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
             dispatchAchievement('SCROLL_MASTER');
         }
     };
     window.addEventListener('scroll', handleScroll);
     return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-slate-200 selection:bg-[#ccff00] selection:text-black relative">
      <CustomCursor />
      <SystemMonitor />
      <Gamification />
      <Overdrive />
      <WarpTransition />
      <CommandPalette />
      <SystemWipe />
      
      {/* Boot Screen */}
      <AnimatePresence>
        {loading && (
            <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[1000] bg-black font-mono text-[#ccff00] p-6 md:p-12 flex flex-col justify-end pointer-events-none"
            >
                <div className="max-w-2xl w-full mx-auto md:mx-0">
                    {bootLines.map((line, i) => (
                        <motion.div 
                           key={i}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.1 }}
                           className="text-xs md:text-sm mb-1 whitespace-nowrap overflow-hidden"
                        >
                            {line}
                        </motion.div>
                    ))}
                    <div className="h-4 w-2 bg-[#ccff00] animate-pulse mt-2"></div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
      
      <Background />
      <div className="bg-noise"></div>
      
      {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Header />
            <main className="relative z-10">
                <Hero />
                <div id="terminal" className="scroll-mt-20">
                <InteractiveTerminal />
                </div>
                <Services />
                <Experience />
                <Projects />
                <Testimonials />
                <Skills />
                <Blog />
                <Contact />
            </main>
            <Chatbot />
          </motion.div>
      )}
    </div>
  );
};

export default App;
