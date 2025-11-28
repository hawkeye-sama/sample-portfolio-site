
import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useTransform, motion } from 'framer-motion';

const ScrollVelocityDistortion: React.FC = () => {
  const { scrollY } = useScroll();
  const [skew, setSkew] = useState(0);
  
  // Track previous scroll position to calculate velocity manually for tighter control
  const prevScrollY = useRef(0);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const loop = () => {
      const current = window.scrollY;
      const velocity = current - prevScrollY.current;
      prevScrollY.current = current;

      // Dampen the velocity for the skew effect
      // Max skew limited to prevent unreadable text
      const targetSkew = Math.max(Math.min(velocity * 0.1, 10), -10);
      
      setSkew(prev => prev + (targetSkew - prev) * 0.1); // Linear interpolation for smoothness

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <>
        {/* RGB Split Layer - Red (Lags behind) */}
        <div 
            className="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen opacity-50 hidden md:block"
            style={{ 
                transform: `skewY(${skew}deg) translateY(${skew * 2}px)`,
                filter: `blur(${Math.abs(skew) / 2}px)`,
                // We only want to apply this to a copy of the screen, but CSS backdrop-filter doesn't support RGB splitting easily.
                // Instead, we use a visual trick with borders or a vignette that distorts.
            }}
        >
        </div>

        {/* We inject a global style to skew the main app wrapper based on velocity */}
        <style>{`
            main {
                transition: transform 0.1s ease-out;
                transform: skewY(${skew * -0.5}deg);
            }
            
            /* Apply RGB Shift to text when scrolling fast */
            .velocity-active h1, .velocity-active h2 {
                text-shadow: 
                    ${skew}px 0px 2px rgba(255,0,0,0.5),
                    ${-skew}px 0px 2px rgba(0,0,255,0.5);
            }
        `}</style>

        {/* Vignette Distortion Overlay that intensifies with speed */}
        <div 
            className="fixed inset-0 pointer-events-none z-[50]"
            style={{
                boxShadow: `inset 0 0 ${Math.abs(skew) * 20}px rgba(0,0,0,0.8)`,
                transition: 'box-shadow 0.1s linear'
            }}
        />
    </>
  );
};

export default ScrollVelocityDistortion;
