
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const triggerSystemWipe = (detail?: { os: string }) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('system-wipe', { detail }));
    }
};

const SystemWipe: React.FC = () => {
    const [active, setActive] = useState(false);
    const [dead, setDead] = useState(false);
    const [os, setOs] = useState('Linux');

    useEffect(() => {
        const handler = (e: CustomEvent) => {
            if (e.detail?.os) setOs(e.detail.os);
            setActive(true);
            setTimeout(() => {
                setDead(true);
            }, 3000);
        };
        window.addEventListener('system-wipe' as any, handler);
        return () => window.removeEventListener('system-wipe' as any, handler);
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
                        transition={{ duration: 3, ease: "easeInOut" }}
                    />
                    
                    {/* Chaotic Overlays */}
                    <motion.div 
                        className="absolute inset-0 bg-red-500 mix-blend-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0, 0.6, 0] }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                    />

                     {/* Screen Tearing */}
                    <div className="absolute inset-0 flex flex-col pointer-events-none mix-blend-difference z-30">
                        {Array.from({ length: 10 }).map((_, i) => (
                             <motion.div 
                                key={i}
                                className="w-full bg-white/20"
                                initial={{ height: 0, y: Math.random() * 1000 }}
                                animate={{ height: [0, 50, 0], x: [-20, 20, -10] }}
                                transition={{ duration: 0.2, repeat: Infinity, delay: Math.random() }}
                             />
                        ))}
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center mix-blend-difference z-20">
                         <h1 className="text-[10vw] font-black text-white opacity-10 animate-pulse">CRITICAL_FAILURE</h1>
                    </div>
                 </>
             )}

             {/* Death Screen */}
             <AnimatePresence>
                {dead && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute inset-0 flex flex-col pointer-events-auto p-0 cursor-none ${
                            os === 'Windows' ? 'bg-[#0078d7] text-white items-start p-16 md:p-32' : 'bg-black text-white items-start p-8 font-mono'
                        }`}
                    >
                        {os === 'Windows' ? (
                            // WINDOWS BSOD
                            <div className="max-w-4xl w-full font-segoe">
                                <h1 className="text-8xl md:text-9xl mb-8">:(</h1>
                                <p className="text-2xl md:text-3xl mb-8">Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</p>
                                <p className="text-2xl md:text-3xl mb-12">0% complete</p>
                                
                                <div className="flex items-start gap-4">
                                     <div className="w-24 h-24 bg-white p-1">
                                        {/* Fake QR */}
                                        <div className="w-full h-full bg-black flex flex-wrap content-start">
                                            {Array.from({length: 64}).map((_,i) => (
                                                <div key={i} className={`w-[12.5%] h-[12.5%] ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}></div>
                                            ))}
                                        </div>
                                     </div>
                                     <div className="text-sm md:text-base leading-relaxed">
                                         <p>For more information about this issue and possible fixes, visit https://www.windows.com/stopcode</p>
                                         <p className="mt-2">If you call a support person, give them this info:</p>
                                         <p>Stop code: CRITICAL_PROCESS_DIED</p>
                                     </div>
                                </div>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="absolute bottom-10 right-10 bg-white text-[#0078d7] px-6 py-2 font-bold hover:bg-gray-200"
                                >
                                    REBOOT SYSTEM
                                </button>
                            </div>
                        ) : (
                            // LINUX / MAC KERNEL PANIC
                            <div className="w-full h-full overflow-hidden text-sm md:text-base font-mono text-gray-300">
                                <p className="bg-white text-black px-1 w-fit mb-2">KERNEL PANIC - NOT SYNCING: FATAL EXCEPTION IN INTERRUPT HANDLER</p>
                                <p>Pid: 1, comm: init Not tainted 4.19.0-16-amd64 #1 Debian 4.19.181-1</p>
                                <p>Call Trace:</p>
                                <p className="ml-4 text-gray-400">
                                   [&lt;ffffffff817e1e6b&gt;] ? dump_stack+0x66/0x81<br/>
                                   [&lt;ffffffff817e1e6b&gt;] ? panic+0xe4/0x24d<br/>
                                   [&lt;ffffffff810f60a0&gt;] ? do_exit+0x4e0/0xb60<br/>
                                   [&lt;ffffffff810f67f0&gt;] ? do_group_exit+0x50/0xd0<br/>
                                   [&lt;ffffffff810f6887&gt;] ? __wake_up_parent+0x0/0x30
                                </p>
                                <p className="mt-4">RIP: 0010:rm_rf_slash+0x42/0x80 [core]</p>
                                <p>RSP: 0018:ffffb9e0c0003f58 EFLAGS: 00010246</p>
                                <p className="mt-4 text-red-500 font-bold blinking-cursor">
                                   [    14.234102] ---[ end Kernel panic - not syncing: Attempted to kill init! ]---
                                </p>
                                
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="mt-12 border border-gray-500 px-6 py-2 hover:bg-white hover:text-black transition-colors"
                                >
                                    HARD_RESET_CPU_0
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
             </AnimatePresence>
        </div>
    );
};

export default SystemWipe;
