import { cn } from "@/lib/utils";
import { Sparkles, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ModelCardProps {
  name: string;
  icon: string;
  className?: string;
}

export function ModelCard({ name, icon, className }: ModelCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-6 py-4 border-b border-border bg-gradient-to-r from-card via-card/80 to-card backdrop-blur-sm sticky top-0 z-10",
        className
      )}
    >
      <motion.div 
        className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-2xl shadow-sm border border-primary/10"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {icon}
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
          </motion.div>
          <h3 className="font-bold text-foreground">{name}</h3>
          <Activity className="h-3.5 w-3.5 text-green-500 ml-auto" />
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-medium">AI Medical Specialist • Active</p>
      </div>
    </div>
  );
}