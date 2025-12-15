import { Activity, Shield, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

const stats: Stat[] = [
  { icon: Shield, label: "Encryption", value: "256-bit AES", color: "text-primary" },
  { icon: Activity, label: "Status", value: "Protected", color: "text-cyber-green" },
  { icon: Zap, label: "Speed", value: "Ultra Fast", color: "text-accent" },
  { icon: Clock, label: "Uptime", value: "99.9%", color: "text-primary" },
];

const StatsDisplay = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl",
            "glass border border-border/30 hover:border-primary/30 transition-all duration-300",
            "group hover:scale-105"
          )}
        >
          <stat.icon className={cn("w-6 h-6 transition-all duration-300", stat.color, "group-hover:scale-110")} />
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</p>
          <p className={cn("text-sm font-semibold", stat.color)}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;
