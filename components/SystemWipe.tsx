
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const triggerSystemWipe = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('system-wipe'));
    }
};

const SystemWipe: React.FC = () => {
    const [active, setActive] = useState(false);
    const [dead, setDead] = useState(false);

    useEffect(() => {
        const handler = () => {
            setActive(true);
            // Wait for the "void" animation to consume the screen
            setTimeout(() => {
                setDead(true);
            }, 4000);
        };
        window.addEventListener('system-wipe', handler);
        return () => window.removeEventListener('system-wipe', handler);
    }, []);

    if (!active) return null;

    return (
        <div className="fixed inset-0 z-[99999] pointer-events-none font-mono">
             {/* The Void Consuming - Circular Expansion */}
             {!dead && (
                 <>
                    <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    />
                    
                    {/* Chaotic Overlays */}
                    <motion.div 
                        className="absolute inset-0 bg-red-500 mix-blend-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0, 0.6, 0] }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center mix-blend-difference z-20">
                         <h1 className="text-[10vw] font-black text-white opacity-10 animate-pulse">DELETING...</h1>
                    </div>
                 </>
             )}

             {/* Death Screen */}
             <AnimatePresence>
                {dead && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black flex flex-col items-center justify-center p-8 text-red-600 pointer-events-auto"
                    >
                        <div className="max-w-2xl w-full border border-red-900 p-8 bg-black shadow-[0_0_50px_rgba(255,0,0,0.1)]">
                            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">SYSTEM HALTED</h1>
                            <div className="space-y-2 font-mono text-sm md:text-base mb-12 border-l-2 border-red-600 pl-4">
                                <p>CRITICAL ERROR: ROOT FILESYSTEM MISSING</p>
                                <p>KERNEL PANIC: ATTEMPTED TO KILL INIT</p>
                                <p>ERROR CODE: 0x000000DEAD</p>
                                <p className="animate-pulse mt-4">_NO BOOT DEVICE FOUND</p>
                            </div>
                            
                            <div className="flex justify-center">
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="border border-red-600 px-8 py-3 hover:bg-red-600 hover:text-black transition-all font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
                                >
                                    HARD_REBOOT_SYSTEM()
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
             </AnimatePresence>
        </div>
    );
};

export default SystemWipe;
