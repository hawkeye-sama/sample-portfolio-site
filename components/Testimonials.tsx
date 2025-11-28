import React, { useState } from 'react';
import { TESTIMONIALS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + TESTIMONIALS.length) % TESTIMONIALS.length);
  };
  
  const setPage = (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
  }

  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-black/30 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">WHAT EMPLOYERS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">SAY ABOUT ME</span></h2>
        </motion.div>

        <div className="relative h-[550px] md:h-[400px] flex items-center justify-center">
            {/* Navigation Buttons */}
            <button 
                className="absolute left-0 md:-left-4 z-20 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors backdrop-blur-sm border border-white/5 hidden md:block group"
                onClick={() => paginate(-1)}
            >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
                className="absolute right-0 md:-right-4 z-20 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors backdrop-blur-sm border border-white/5 hidden md:block group"
                onClick={() => paginate(1)}
            >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute max-w-4xl w-full p-8 md:p-16 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl"
                >
                    <div className="absolute top-6 left-8 text-purple-500/20">
                        <Quote size={64} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <img 
                                src={TESTIMONIALS[currentIndex].avatarUrl} 
                                alt={TESTIMONIALS[currentIndex].name} 
                                className="w-24 h-24 rounded-full object-cover border-2 border-white/10 relative z-10" 
                            />
                        </div>
                        
                        <p className="text-xl md:text-3xl text-gray-200 leading-relaxed mb-8 font-light tracking-tight max-w-2xl">
                            "{TESTIMONIALS[currentIndex].content}"
                        </p>
                        
                        <div className="space-y-1">
                            <h4 className="text-white font-bold text-xl tracking-wide">{TESTIMONIALS[currentIndex].name}</h4>
                            <p className="text-sm font-mono text-purple-400 uppercase tracking-widest">{TESTIMONIALS[currentIndex].role}, {TESTIMONIALS[currentIndex].company}</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-4 md:mt-8">
            {TESTIMONIALS.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentIndex ? 'w-8 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;