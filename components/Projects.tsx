
import React, { useRef, useState } from 'react';
import { PROJECTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import DecryptText from './DecryptText';

const ProjectCard: React.FC<{ project: typeof PROJECTS[0]; index: number }> = ({ project, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Scroll Effects
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const yRot = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(yRot, { stiffness: 500, damping: 100 });
  
  const [hover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseXRel = e.clientX - rect.left;
      const mouseYRel = e.clientY - rect.top;
      
      const xPct = mouseXRel / width - 0.5;
      const yPct = mouseYRel / height - 0.5;
      
      x.set(xPct * 20); // Rotate Y axis based on X position
      yRot.set(yPct * -20); // Rotate X axis based on Y position (inverted)
  };
  
  const handleMouseLeave = () => {
      setHover(false);
      x.set(0);
      yRot.set(0);
  };

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y, perspective: 1000 }}
      className="mb-32 last:mb-0 relative z-10"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={handleMouseLeave}
    >
        <motion.div 
            className="group relative border-l-2 border-gray-800 pl-8 md:pl-12 transition-all duration-300 transform-style-3d"
            style={{ 
                rotateX: mouseY, 
                rotateY: mouseX,
            }}
        >
            {/* Number Watermark */}
            <div className="absolute -left-[3rem] top-0 font-display font-black text-8xl text-white/5 select-none -z-10 group-hover:text-white/10 transition-colors transform translate-z-[-50px]">
              0{index + 1}
            </div>

            {/* Image Area */}
            <div className="relative aspect-video overflow-hidden mb-8 bg-black clip-corner border border-gray-800 shadow-2xl transform-style-3d">
                <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-110">
                    <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100" 
                        loading="lazy"
                    />
                </div>
                
                {/* Holographic Glare */}
                <div 
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                    style={{ transform: `translate(${x.get() * 2}%, ${yRot.get() * 2}%)` }}
                ></div>

                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur border border-[#ccff00]/30 px-3 py-1 font-mono text-xs text-[#ccff00] z-20 translate-z-[20px]">
                    SECURE_VIEW
                </div>
            </div>

            {/* Content Area */}
            <div className="pr-4 transform-style-3d translate-z-[30px]">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
                    <h3 className="font-display text-4xl md:text-5xl text-white group-hover:text-[#ccff00] transition-colors uppercase leading-none">
                      {project.title}
                    </h3>
                    <a href={project.link} className="p-3 bg-white/5 hover:bg-[#ccff00] hover:text-black transition-colors border border-white/10 w-fit">
                        <ArrowUpRight size={24} />
                    </a>
                </div>
                
                <p className="font-mono text-base text-gray-400 mb-8 max-w-2xl border-l border-gray-800 pl-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono uppercase bg-[#7000df]/10 text-[#7000df] px-3 py-1.5 border border-[#7000df]/20 hover:bg-[#7000df] hover:text-white transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-32 relative bg-[#050505] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-32 border-b border-gray-800 pb-8">
            <div>
                <h2 className="font-display text-5xl md:text-8xl font-black text-white mb-2 tracking-tighter">
                    <DecryptText text="WORK" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-transparent">LOGS</span>
                </h2>
            </div>
            <div className="hidden md:block font-mono text-right text-gray-500 text-xs">
                <div>ENCRYPTED_ARCHIVE_V2</div>
                <div>ACCESS_LEVEL: PUBLIC</div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
            {PROJECTS.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
            ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;
