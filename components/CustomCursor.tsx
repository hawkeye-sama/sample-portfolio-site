
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [variant, setVariant] = useState('default'); // default, plasma

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 20, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Trail State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<{x: number, y: number, age: number}[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleEquip = (e: CustomEvent) => {
        setVariant(e.detail);
    };
    window.addEventListener('equip-cursor' as any, handleEquip);
    return () => window.removeEventListener('equip-cursor' as any, handleEquip);
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Add point to trail
      pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'A' || 
          (e.target as HTMLElement).tagName === 'BUTTON' ||
          (e.target as HTMLElement).closest('a') ||
          (e.target as HTMLElement).closest('button') ||
          (e.target as HTMLElement).classList.contains('cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    // Canvas Trail Loop
    const animateTrail = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Resize if needed
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#ccff00';

        // Draw trail
        for (let i = 0; i < pointsRef.current.length; i++) {
            const point = pointsRef.current[i];
            const nextPoint = pointsRef.current[i + 1];
            
            point.age++;
            
            if (nextPoint) {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(nextPoint.x, nextPoint.y);
                
                // Color based on hover state
                const alpha = 1 - (point.age / (variant === 'plasma' ? 40 : 20)); 
                if (alpha <= 0) continue;
                
                if (variant === 'plasma') {
                    ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
                    ctx.lineWidth = (1 - (point.age/40)) * 10;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#00f3ff';
                } else {
                    // Default Acid Green / Red
                    ctx.strokeStyle = isHovering 
                        ? `rgba(255, 0, 60, ${alpha})` 
                        : primaryColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', '');
                    // Quick fix for hex to rgba if needed, keeping simple for now assuming hex mostly works or browser handles it
                    if (primaryColor.startsWith('#')) {
                        // Basic hex to rgb conversion if needed for canvas context
                        ctx.strokeStyle = primaryColor;
                        ctx.globalAlpha = alpha;
                    }
                    ctx.lineWidth = isHovering ? 4 : 2;
                    ctx.shadowBlur = 0;
                }
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
        
        // Remove old points
        pointsRef.current = pointsRef.current.filter(p => p.age < (variant === 'plasma' ? 40 : 20));
        
        requestRef.current = requestAnimationFrame(animateTrail);
    };
    
    animateTrail();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(requestRef.current);
    };
  }, [cursorX, cursorY, isHovering, variant]);

  return (
    <>
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none z-[99]"
        />
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center mix-blend-difference"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: "-50%",
                translateY: "-50%"
            }}
        >
        
        {variant === 'default' && (
            <>
                <motion.div className="w-1 h-1 bg-primary" />
                <motion.div 
                    className="absolute w-8 h-[1px] bg-primary"
                    animate={{
                    width: isHovering ? 40 : 20,
                    rotate: isHovering ? 45 : 0
                    }}
                />
                <motion.div 
                    className="absolute h-8 w-[1px] bg-primary"
                    animate={{
                    height: isHovering ? 40 : 20,
                    rotate: isHovering ? 45 : 0
                    }}
                />
                <motion.div
                    className="absolute border border-primary rounded-full"
                    animate={{
                    width: isHovering ? 60 : 0,
                    height: isHovering ? 60 : 0,
                    opacity: isHovering ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                />
            </>
        )}

        {variant === 'plasma' && (
            <>
                 <motion.div 
                    className="w-4 h-4 rounded-full bg-cyan-400 blur-[2px]"
                    animate={{ scale: isHovering ? 1.5 : 1 }}
                 />
                 <motion.div 
                    className="absolute w-12 h-12 rounded-full border-2 border-cyan-400 border-dashed animate-spin-slow"
                    animate={{ scale: isHovering ? 1.2 : 1 }}
                 />
            </>
        )}
        </motion.div>
    </>
  );
};

export default CustomCursor;
