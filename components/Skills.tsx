
import React from 'react';
import { SKILLS } from '../constants';
import { motion } from 'framer-motion';
import SkillCloud from './SkillCloud';

const Skills: React.FC = () => {
  const allSkills = SKILLS.flatMap(s => s.items);
  // Repeat enough times for marquee fallback
  const tickerItems = [...allSkills, ...allSkills];

  return (
    <section id="skills" className="relative bg-[#050505] text-white overflow-hidden border-t border-gray-900">
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left: 3D Cloud */}
          <div className="bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#050505_100%)] border-b lg:border-b-0 lg:border-r border-gray-900 flex flex-col items-center justify-center relative min-h-[500px]">
             <div className="absolute top-6 left-6 font-mono text-xs text-[#ccff00]">
                 <div className="flex items-center gap-2 mb-1">
                     <span className="w-2 h-2 bg-[#ccff00] animate-pulse"></span>
                     NEURAL_NET_VISUALIZER
                 </div>
                 <div className="opacity-50">INTERACTIVE_MODE: ENABLED</div>
             </div>
             <SkillCloud />
          </div>

          {/* Right: Categorized List */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
             <div className="mb-10">
                 <h2 className="text-4xl md:text-6xl font-black font-display mb-4 text-white">
                     TECH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-transparent">STACK</span>
                 </h2>
                 <p className="font-mono text-gray-500 text-sm max-w-md">
                     ARSENAL OF TOOLS & FRAMEWORKS DEPLOYED IN PRODUCTION ENVIRONMENTS.
                 </p>
             </div>

             <div className="space-y-8">
                 {SKILLS.map((category, idx) => (
                     <div key={idx} className="group">
                         <h3 className="font-mono text-[#ccff00] mb-3 text-sm tracking-widest uppercase flex items-center gap-2">
                             <span className="opacity-50">0{idx + 1} //</span> {category.category}
                         </h3>
                         <div className="flex flex-wrap gap-2">
                             {category.items.map(item => (
                                 <span key={item} className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-colors cursor-default">
                                     {item}
                                 </span>
                             ))}
                         </div>
                     </div>
                 ))}
             </div>
          </div>
      </div>

      {/* Marquee Footer */}
      <div className="relative flex py-4 border-y border-gray-800 bg-[#0a0a0a]">
        <motion.div 
          className="flex whitespace-nowrap items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {tickerItems.map((skill, i) => (
            <div key={`${skill}-${i}`} className="flex items-center mx-6 opacity-30">
              <span className="font-mono text-sm uppercase tracking-widest">
                {skill}
              </span>
              <span className="ml-6 text-xs text-[#ccff00]">+</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
