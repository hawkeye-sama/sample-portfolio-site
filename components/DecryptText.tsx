
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

interface DecryptTextProps {
  text: string;
  className?: string;
  speed?: number;
  revealSpeed?: number;
}

const DecryptText: React.FC<DecryptTextProps> = ({ 
  text, 
  className = "", 
  speed = 30,
  revealSpeed = 50 
}) => {
  const [displayText, setDisplayText] = useState(text.split('').map(() => ' '));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (!isInView) return;
    
    let interval: number;
    let iteration = 0;
    
    interval = window.setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((letter, index) => {
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("") as any
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1/3;
    }, speed);

    return () => clearInterval(interval);
  }, [isInView, text, speed]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
};

export default DecryptText;
