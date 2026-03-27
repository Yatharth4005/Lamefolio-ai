import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.15]"
    >
      <div className="absolute inset-0 bg-[#080808]" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Interactive Squares */}
      <div className="absolute inset-0 flex flex-wrap content-start">
        {Array.from({ length: 400 }).map((_, i) => (
          <Square key={i} x={springX} y={springY} index={i} containerRef={containerRef} />
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#080808_80%)]" />
    </div>
  );
}

function Square({ x, y, index, containerRef }: { x: any, y: any, index: number, containerRef: React.RefObject<HTMLDivElement> }) {
  const squareRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState(0);
  const [opacity, setOpacity] = useState(0.1);

  useEffect(() => {
    const unsubscribe = x.on("change", () => {
      if (!squareRef.current || !containerRef.current) return;
      
      const rect = squareRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse to square center
      const dx = window.innerWidth * x.get() + containerRect.left - centerX;
      const dy = window.innerHeight * y.get() + containerRect.top - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Affect squares within 300px
      const maxDist = 300;
      if (distance < maxDist) {
        const strength = 1 - (distance / maxDist);
        setRotate(strength * 45); // Max 45 deg rotation
        setOpacity(0.1 + strength * 0.4);
      } else {
        setRotate(0);
        setOpacity(0.1);
      }
    });

    return () => unsubscribe();
  }, [x, y]);

  return (
    <div 
      ref={squareRef}
      className="w-[60px] h-[60px] flex items-center justify-center"
    >
      <motion.div 
        animate={{ rotate, opacity }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-[20%] h-[20%] bg-primary rounded-[1px]"
      />
    </div>
  );
}
