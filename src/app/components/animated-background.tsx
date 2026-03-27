import { motion, useSpring, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useGitHub } from "../context/GitHubContext";

export function AnimatedBackground() {
  const { plan } = useGitHub();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const isPremium = plan?.toLowerCase() === 'premium';
  const isPro = plan?.toLowerCase() === 'pro';

  // Dynamic colors based on plan
  const planColors = {
    primary: isPremium ? '#fbbf24' : isPro ? '#94a3b8' : 'var(--primary)',
    secondary: isPremium ? '#d97706' : isPro ? '#64748b' : 'var(--primary)',
    opacity: isPremium ? 0.2 : isPro ? 0.12 : 0.08
  };

  const springX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Starfield Layer (Subtle) */}
      <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.4] light:hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5 + "px",
              height: Math.random() * 2 + 0.5 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Cursor Sparkles (Pro/Premium Only) */}
      {(isPremium || isPro) && (
          <CursorTrail color={planColors.primary} />
      )}



      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${planColors.primary} 0%, transparent 70%)`,
          opacity: planColors.opacity,
          filter: "blur(70px)",
          willChange: "transform",
        }}
        animate={{ x: [0, 50, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${planColors.secondary} 0%, transparent 70%)`,
          opacity: planColors.opacity / 2,
          filter: "blur(90px)",
          willChange: "transform",
        }}
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The Dynamic Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] light:opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), 
                            linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Interactive Squares Layer */}
      <div className="absolute inset-0 flex flex-wrap content-start">
        {Array.from({ length: 400 }).map((_, i) => (
          <Square key={i} x={springX} y={springY} color={planColors.primary} />
        ))}
      </div>

      {/* Vignette for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,var(--app-background)_85%)]" />
    </div>
  );
}

function CursorTrail({ color }: { color: string }) {
    const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const id = Date.now() + Math.random();
            setSparks(prev => [...prev.slice(-12), { id, x: e.clientX, y: e.clientY }]);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {sparks.map(spark => (
                <motion.div
                    key={spark.id}
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute w-1 h-1 rounded-full blur-[0.5px]"
                    style={{ 
                        left: spark.x, 
                        top: spark.y, 
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}`
                    }}
                />
            ))}
        </div>
    );
}

function Square({ x, y, color }: { x: any, y: any, color: string }) {
  const squareRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState(0);
  const [opacity, setOpacity] = useState(0.05);

  useEffect(() => {
    return x.on("change", () => {
      if (!squareRef.current) return;
      
      const rect = squareRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = window.innerWidth * x.get() - centerX;
      const dy = window.innerHeight * y.get() - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const maxDist = 250;
      if (distance < maxDist) {
        const strength = 1 - (distance / maxDist);
        setRotate(strength * 35);
        setOpacity(0.03 + strength * 0.4);
      } else {
        setRotate(0);
        setOpacity(0.03);
      }
    });
  }, [x, y]);

  return (
    <div 
      ref={squareRef}
      className="w-[40px] h-[40px] flex items-center justify-center pointer-events-none"
    >
      <motion.div 
        animate={{ rotate, opacity, backgroundColor: color }}
        transition={{ type: "spring", stiffness: 1000, damping: 60 }}
        className="w-[10%] h-[10%] rounded-[1px]"
      />
    </div>
  );
}
