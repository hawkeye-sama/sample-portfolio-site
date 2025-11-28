
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
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
                const alpha = 1 - (point.age / 20); // Fade out over 20 frames
                if (alpha <= 0) continue;
                
                ctx.strokeStyle = isHovering 
                    ? `rgba(255, 0, 60, ${alpha})` // Red on hover
                    : `rgba(204, 255, 0, ${alpha})`; // Acid Green default
                ctx.lineWidth = isHovering ? 4 : 2;
                ctx.stroke();
            }
        }
        
        // Remove old points
        pointsRef.current = pointsRef.current.filter(p => p.age < 20);
        
        requestRef.current = requestAnimationFrame(animateTrail);
    };
    
    animateTrail();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(requestRef.current);
    };
  }, [cursorX, cursorY, isHovering]);

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
        {/* Crosshair Center */}
        <motion.div 
            className="w-1 h-1 bg-[#ccff00]"
        />
        
        {/* Crosshair Lines */}
        <motion.div 
            className="absolute w-8 h-[1px] bg-[#ccff00]"
            animate={{
            width: isHovering ? 40 : 20,
            rotate: isHovering ? 45 : 0
            }}
        />
        <motion.div 
            className="absolute h-8 w-[1px] bg-[#ccff00]"
            animate={{
            height: isHovering ? 40 : 20,
            rotate: isHovering ? 45 : 0
            }}
        />

        {/* Outer Ring */}
        <motion.div
            className="absolute border border-[#ccff00] rounded-full"
            animate={{
            width: isHovering ? 60 : 0,
            height: isHovering ? 60 : 0,
            opacity: isHovering ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
        />
        </motion.div>
    </>
  );
};

export default CustomCursor;
