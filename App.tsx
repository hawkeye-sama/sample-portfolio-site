
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
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake boot sequence time
    const timer = setTimeout(() => setLoading(false), 2500);
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
      
      {/* Boot Screen */}
      <AnimatePresence>
        {loading && (
            <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center font-mono text-[#ccff00]"
            >
                <div className="w-64">
                    <div className="mb-2 text-xs">BIOS CHECK... OK</div>
                    <div className="mb-2 text-xs">MEMORY... 64GB OK</div>
                    <div className="mb-2 text-xs">LOADING ASSETS...</div>
                    <div className="h-1 bg-gray-900 w-full mt-4 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "linear" }}
                            className="h-full bg-[#ccff00]"
                        />
                    </div>
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
