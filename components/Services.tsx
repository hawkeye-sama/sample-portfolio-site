import React from 'react';
import { SERVICES } from '../constants';
import { motion } from 'framer-motion';
import { BrainCircuit, Layers, Cpu, Palette, Hexagon, ScanLine } from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  BrainCircuit,
  Layers,
  Cpu,
  Palette
};

const ServiceCard: React.FC<{ service: typeof SERVICES[0]; index: number }> = ({ service, index }) => {
  const Icon = iconMap[service.icon];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative perspective-1000"
    >
      <div className="h-full bg-[#0a0a0a] border border-gray-800 p-8 relative overflow-hidden transition-all duration-300 hover:border-[#ccff00] hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] clip-corner">
        
        {/* Laser Scan Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ccff00]/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Tech Decor */}
        <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-1 h-1 bg-gray-700 rounded-full group-hover:bg-[#ccff00]"></div>
            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
        </div>

        {/* Icon */}
        <div className="relative z-10 w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#ccff00] transition-colors duration-300">
           {Icon && <Icon size={32} className="text-white group-hover:text-black transition-colors duration-300" />}
           
           {/* Corner Brackets */}
           <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#ccff00] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-top-2 group-hover:-right-2"></div>
           <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-[#ccff00] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-bottom-2 group-hover:-left-2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 opacity-50 font-mono text-xs">
             <Hexagon size={10} className="text-[#ccff00]" />
             <span>MODULE_0{index + 1}</span>
          </div>
          
          <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-[#ccff00] transition-colors uppercase tracking-tight">
            {service.title}
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed font-mono border-l-2 border-transparent group-hover:border-[#7000df] pl-0 group-hover:pl-4 transition-all duration-300">
            {service.description}
          </p>
        </div>
        
        {/* Bottom Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div className="h-full bg-[#ccff00] w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
        </div>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 relative bg-black overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#ccff00]/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="mb-20 flex items-end justify-between border-b border-gray-800 pb-6"
        >
          <div>
            <span className="text-[#ccff00] font-mono text-sm tracking-widest uppercase mb-2 block flex items-center gap-2">
                <ScanLine size={14} /> SYSTEM CAPABILITIES
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              SERVICES
            </h2>
          </div>
          <div className="hidden md:block w-1/3 h-px bg-gradient-to-l from-[#ccff00] to-transparent mb-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;