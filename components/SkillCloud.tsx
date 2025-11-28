
import React, { useEffect, useRef } from 'react';
import { SKILLS } from '../constants';

const SkillCloud: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 600;
    let height = 600;
    
    // Config
    const GLOBE_RADIUS = 180;
    const DOT_RADIUS = 2;
    const CONNECTION_DISTANCE = 100;
    const ROTATION_SPEED_BASE = 0.002;
    
    // State
    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    // Prepare Nodes
    const allSkills = SKILLS.flatMap(s => s.items);
    const nodes: {
      x: number, y: number, z: number, 
      text: string, 
      px: number, py: number, scale: number, opacity: number 
    }[] = [];

    // Fibonacci Sphere Distribution
    for (let i = 0; i < allSkills.length; i++) {
      const phi = Math.acos(-1 + (2 * i) / allSkills.length);
      const theta = Math.sqrt(allSkills.length * Math.PI) * phi;
      
      nodes.push({
        text: allSkills[i],
        x: GLOBE_RADIUS * Math.cos(theta) * Math.sin(phi),
        y: GLOBE_RADIUS * Math.sin(theta) * Math.sin(phi),
        z: GLOBE_RADIUS * Math.cos(phi),
        px: 0, py: 0, scale: 0, opacity: 0
      });
    }

    const resize = () => {
        if (!containerRef.current) return;
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight;
        canvas.width = width;
        canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX = e.clientX - rect.left - width / 2;
        mouseY = e.clientY - rect.top - height / 2;
        isHovering = true;
        
        targetRotationY = mouseX * 0.0005;
        targetRotationX = -mouseY * 0.0005;
    };

    const handleMouseLeave = () => {
        isHovering = false;
        targetRotationY = ROTATION_SPEED_BASE;
        targetRotationX = 0;
    };

    const project = (x: number, y: number, z: number) => {
        const scale = 400 / (400 - z);
        const px = (x * scale) + width / 2;
        const py = (y * scale) + height / 2;
        return { px, py, scale };
    };

    const rotate = (node: any, angleX: number, angleY: number) => {
        // Rotate Y
        let dy = node.y * Math.cos(angleX) - node.z * Math.sin(angleX);
        let dz = node.y * Math.sin(angleX) + node.z * Math.cos(angleX);
        node.y = dy;
        node.z = dz;

        // Rotate X
        let dx = node.x * Math.cos(angleY) - node.z * Math.sin(angleY);
        dz = node.x * Math.sin(angleY) + node.z * Math.cos(angleY);
        node.x = dx;
        node.z = dz;
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        // Smooth rotation
        if (isHovering) {
            rotationX += (targetRotationX - rotationX) * 0.1;
            rotationY += (targetRotationY - rotationY) * 0.1;
        } else {
            rotationY = ROTATION_SPEED_BASE;
            rotationX = 0.001 * Math.sin(Date.now() / 2000);
        }

        // Update Nodes
        nodes.forEach(node => {
            rotate(node, rotationX, rotationY);
            const { px, py, scale } = project(node.x, node.y, node.z);
            node.px = px;
            node.py = py;
            node.scale = scale;
            // Opacity based on Z-depth (fade out back nodes)
            node.opacity = Math.max(0.1, (node.z + GLOBE_RADIUS) / (2 * GLOBE_RADIUS));
        });

        // Draw Connections
        nodes.forEach((node, i) => {
            // Optimization: Only check a subset or neighbors in a real large graph, but ok for < 50 nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dz = node.z - other.z;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

                if (dist < CONNECTION_DISTANCE) {
                    const alpha = (1 - dist / CONNECTION_DISTANCE) * node.opacity * other.opacity;
                    if (alpha > 0.05) {
                        ctx.beginPath();
                        ctx.moveTo(node.px, node.py);
                        ctx.lineTo(other.px, other.py);
                        ctx.strokeStyle = `rgba(204, 255, 0, ${alpha * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        });

        // Draw Nodes & Text
        nodes.sort((a, b) => b.z - a.z); // Painter's algorithm

        nodes.forEach(node => {
            if (node.opacity < 0.2) return; // Skip hidden nodes for cleaner text
            
            // Draw Dot
            ctx.beginPath();
            ctx.arc(node.px, node.py, DOT_RADIUS * node.scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(204, 255, 0, ${node.opacity})`;
            ctx.fill();

            // Draw Text
            ctx.font = `${Math.max(8, 12 * node.scale)}px 'JetBrains Mono', monospace`;
            ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity})`;
            ctx.fillText(node.text, node.px, node.py - 10 * node.scale);
        });

        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);
    
    resize();
    animate();

    return () => {
        window.removeEventListener('resize', resize);
        containerRef.current?.removeEventListener('mousemove', handleMouseMove);
        containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] flex items-center justify-center cursor-move active:cursor-grabbing">
       <canvas ref={canvasRef} />
    </div>
  );
};

export default SkillCloud;
