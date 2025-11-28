import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, MousePointer2, MoveVertical, Cpu } from 'lucide-react';

const SystemMonitor: React.FC = () => {
  const [scrollPos, setScrollPos] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cpuLoad, setCpuLoad] = useState<number[]>(new Array(20).fill(10));

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(Math.round(window.scrollY));
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Fake CPU load simulation
    const interval = setInterval(() => {
      setCpuLoad(prev => {
        const next = [...prev.slice(1), Math.random() * 80 + 10];
        return next;
      });
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden xl:flex flex-col gap-2 font-mono text-[10px] text-[#ccff00] pointer-events-none select-none mix-blend-difference">
      
      {/* Decorative Header */}
      <div className="flex items-center gap-2 mb-2 opacity-50">
        <Cpu size={12} />
        <span className="tracking-widest">SYSTEM_MONITOR_V1.2</span>
      </div>

      <div className="flex items-end gap-1 h-8 w-32 border-b border-[#ccff00]/30 pb-1 mb-2">
         {cpuLoad.map((val, i) => (
             <motion.div 
               key={i}
               className="flex-1 bg-[#ccff00]"
               animate={{ height: `${val}%`, opacity: val > 80 ? 1 : 0.5 }}
               transition={{ type: "tween", duration: 0.2 }}
             />
         ))}
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
        <div className="flex items-center gap-2">
           <MoveVertical size={10} />
           <span>SCROLL_Y: {scrollPos.toString().padStart(5, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
           <MousePointer2 size={10} />
           <span>X: {mousePos.x.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
           <Activity size={10} />
           <span>FPS: 60.0</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 border border-[#ccff00] flex items-center justify-center">
             <span className="w-0.5 h-0.5 bg-[#ccff00]"></span>
           </span>
           <span>Y: {mousePos.y.toString().padStart(4, '0')}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;