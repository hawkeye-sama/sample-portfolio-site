
import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Optimize: Disable alpha channel since we paint full background
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrameId: number;

    // Data Packets system
    const packets: { x: number, z: number, speed: number, color: string }[] = [];
    
    const initPackets = () => {
        // Create initial pool
        for(let i = 0; i < 20; i++) {
            spawnPacket();
        }
    }

    const spawnPacket = () => {
        // Spawn far away
        packets.push({
            x: (Math.random() - 0.5) * 4000, // Random lane
            z: 2000 + Math.random() * 2000,
            speed: 10 + Math.random() * 20,
            color: Math.random() > 0.8 ? '#ffffff' : '#ccff00'
        });
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const drawGrid = () => {
      // Clear with solid color (faster than clearRect with alpha)
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Grid settings
      const horizonY = height * 0.4; // Horizon line height
      const offset = (frame * 2) % 40; // Movement speed optimized

      // Floor Gradient - Draw once
      const gradient = ctx.createLinearGradient(0, horizonY, 0, height);
      gradient.addColorStop(0, '#050505');
      gradient.addColorStop(0.2, 'rgba(204, 255, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(204, 255, 0, 0.2)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      ctx.strokeStyle = 'rgba(204, 255, 0, 0.15)';
      ctx.lineWidth = 1;

      const centerX = width / 2;
      
      // Vertical Perspective Lines - Optimized Loop
      ctx.beginPath();
      // Use fixed x coordinates to simulate infinite lanes
      for(let x = -2000; x <= 2000; x+= 150) {
        const worldX = x;
        ctx.moveTo(centerX, horizonY);
        // Radiating lines
        const angle = (x / 2000) * (Math.PI / 1.5);
        const x2 = centerX + Math.tan(angle) * (height - horizonY);
        ctx.lineTo(x2, height);
      }
      ctx.stroke();

      // Horizontal Moving Lines - Optimized Loop
      ctx.beginPath();
      const zOffset = (frame * 5) % 100;
      
      for(let z = 1000; z > 0; z -= 50) {
         const effectiveZ = z - zOffset;
         if (effectiveZ <= 0) continue;
         
         const scale = 200 / effectiveZ;
         const y = horizonY + scale * 50; 
         
         if (y > height) continue;
         if (y < horizonY) continue; 
         
         ctx.moveTo(0, y);
         ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw Data Packets
      ctx.save();
      packets.forEach((p, i) => {
          p.z -= p.speed;
          if (p.z <= 10) {
              packets.splice(i, 1);
              spawnPacket();
              return;
          }

          const scale = 200 / p.z;
          const y = horizonY + scale * 50;
          
          if (y > height || y < horizonY) return;

          // Calculate X position based on simple perspective
          // We map p.x (world x) to screen x
          const x = centerX + (p.x * scale);

          const size = Math.max(2, 20 * scale);
          
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fillRect(x - size/2, y - size/2, size, size * 0.5);
      });
      ctx.restore();
      
      // Draw Digital Sun
      ctx.beginPath();
      ctx.arc(centerX, horizonY - 150, 100, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      ctx.strokeStyle = '#ccff00';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Scanlines on Sun
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, horizonY - 150, 100, 0, Math.PI * 2);
      ctx.clip();
      
      ctx.fillStyle = 'rgba(204,255,0,0.1)';
      const sunTop = horizonY - 250;
      // Animate scanlines
      const scanOffset = (frame * 0.5) % 10;

      for(let i = 0; i < 20; i++) {
          const y = sunTop + (i * 10) + scanOffset;
          ctx.fillRect(centerX - 100, y, 200, 4);
      }
      ctx.restore();
    };

    const animate = () => {
      frame++;
      drawGrid();
      animationFrameId = requestAnimationFrame(animate);
    };

    initPackets();
    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
       <canvas ref={canvasRef} className="absolute inset-0" />
       <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
    </div>
  );
};

export default Background;
