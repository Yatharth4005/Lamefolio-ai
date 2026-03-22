import { Eye, FolderGit2, Code2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const stats = [
  { icon: Eye, label: "Total Views", value: 2845, change: "+12.5%", color: "from-purple-500 to-pink-500" },
  { icon: FolderGit2, label: "Projects", value: 24, change: "+3 new", color: "from-blue-500 to-cyan-500" },
  { icon: Code2, label: "Skills", value: 18, change: "Verified", color: "from-orange-500 to-pink-500" },
  { icon: TrendingUp, label: "Completion", value: 85, change: "Almost there!", color: "from-green-500 to-emerald-500", suffix: "%" },
];

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ModernStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="relative group"
        >
          {/* Glow effect */}
          <div className={`absolute -inset-[1px] bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
          
          <div className="relative backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 overflow-hidden">
            {/* Icon with gradient background */}
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 relative`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
              <stat.icon className="w-5 h-5 text-white relative z-10" />
            </div>

            <p className="text-sm text-white/50 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-2 tracking-tight">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-xs text-green-400 font-medium">{stat.change}</p>

            {/* Gradient overlay */}
            <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 blur-2xl`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
