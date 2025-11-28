import React, { useRef } from 'react';
import { EXPERIENCE } from '../constants';
import { motion, useScroll, useTransform } from 'framer-motion';

const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Scale the path length based on scroll
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-32 relative bg-black/40 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative" ref={containerRef}>
        
        {/* Header */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="mb-20 pl-16 relative"
        >
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7000df] to-transparent"></div>
           <div className="absolute left-[-5px] top-0 w-3 h-3 bg-[#ccff00]"></div>
           
           <h2 className="text-sm font-mono text-[#ccff00] mb-2 tracking-[0.3em] uppercase">Log_Archive</h2>
           <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
             Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7000df] to-white">History</span>
           </h3>
        </motion.div>

        <div className="relative">
          {/* Animated Circuit Line */}
          <div className="absolute left-[29px] md:left-[39px] top-4 bottom-0 w-10 overflow-visible hidden sm:block">
            <svg className="h-full w-20 overflow-visible" preserveAspectRatio="none">
               <motion.path
                 d="M 1 0 V 100%"
                 fill="none"
                 stroke="#333"
                 strokeWidth="2"
               />
               <motion.path
                 d="M 1 0 V 100%"
                 fill="none"
                 stroke="#ccff00"
                 strokeWidth="2"
                 style={{ pathLength }}
               />
            </svg>
          </div>

          <div className="space-y-16">
            {EXPERIENCE.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20 sm:pl-24 group"
              >
                {/* Circuit Node */}
                <div className="absolute left-[18px] sm:left-[28px] top-6 w-6 h-6 bg-[#050505] border-2 border-gray-700 rounded-none transform rotate-45 z-10 group-hover:border-[#ccff00] group-hover:bg-[#ccff00] transition-colors duration-500 shadow-[0_0_0_4px_#050505]">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-500 group-hover:bg-black transition-colors"></div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="relative p-8 bg-[#0a0a0a] border border-gray-800 clip-corner hover:border-[#7000df] transition-colors duration-300 before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] before:bg-[length:250%_250%,100%_100%] before:animate-shine hover:before:opacity-100 before:opacity-0">
                    
                    {/* Decorative Corner Lines */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gray-800 group-hover:border-[#ccff00] transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gray-800 group-hover:border-[#ccff00] transition-colors"></div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                      <div>
                          <h4 className="text-2xl font-bold text-white group-hover:text-[#ccff00] transition-colors font-display tracking-wide">{exp.role}</h4>
                          <h5 className="text-lg text-[#7000df] font-mono">{exp.company}</h5>
                      </div>
                      <div className="bg-white/5 border border-white/10 px-4 py-1 text-xs font-mono text-gray-400 whitespace-nowrap">
                          {exp.period}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 leading-relaxed font-light border-l border-[#7000df]/30 pl-4">
                        {exp.description}
                    </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;