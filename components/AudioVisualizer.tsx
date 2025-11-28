
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AudioVisualizer: React.FC = () => {
  const [bars, setBars] = useState<number[]>(new Array(32).fill(10));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-[2px] h-12 opacity-50">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[#ccff00]"
          animate={{ height: `${height}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
