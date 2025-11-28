
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const triggerWarp = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('trigger-warp'));
    }
};

const WarpTransition: React.FC = () => {
    const [active, setActive] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const handleTrigger = () => {
            setActive(true);
            setTimeout(() => setActive(false), 1500); // Effect duration
        };
        window.addEventListener('trigger-warp', handleTrigger);
        return () => window.removeEventListener('trigger-warp', handleTrigger);
    }, []);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let speed = 2;
        const stars: {x: number, y: number, z: number}[] = [];
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const cx = width / 2;
        const cy = height / 2;

        for (let i = 0; i < 400; i++) {
            stars.push({
                x: (Math.random() - 0.5) * width * 2,
                y: (Math.random() - 0.5) * height * 2,
                z: Math.random() * width
            });
        }

        const render = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Trails
            ctx.fillRect(0, 0, width, height);
            
            speed *= 1.05; // Accelerate

            stars.forEach(star => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.x = (Math.random() - 0.5) * width * 2;
                    star.y = (Math.random() - 0.5) * height * 2;
                    star.z = width;
                }

                const x = (star.x / star.z) * width + cx;
                const y = (star.y / star.z) * height + cy;
                const size = (1 - star.z / width) * 10;
                
                // Draw streak
                const px = (star.x / (star.z + speed * 2)) * width + cx;
                const py = (star.y / (star.z + speed * 2)) * height + cy;

                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `hsl(${200 + Math.random() * 100}, 100%, 80%)`;
                ctx.lineWidth = size * 0.2;
                ctx.stroke();
            });

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationId);
    }, [active]);

    return (
        <AnimatePresence>
            {active && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] pointer-events-none"
                >
                    <canvas ref={canvasRef} className="w-full h-full" />
                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WarpTransition;
