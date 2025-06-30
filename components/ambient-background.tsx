"use client"

import { motion } from "framer-motion"

interface AmbientBackgroundProps {
  isActive: boolean
  phase: "inhale" | "hold" | "exhale" | "holdAfterExhale"
}

export function AmbientBackground({ isActive, phase }: AmbientBackgroundProps) {
  const getPhaseGradient = () => {
    switch (phase) {
      case "inhale":
        return "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.3), transparent 50%), radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.2), transparent 50%)"
      case "hold":
        return "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.2), transparent 50%)"
      case "exhale":
        return "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3), transparent 50%), radial-gradient(circle at 60% 40%, rgba(5, 150, 105, 0.2), transparent 50%)"
      case "holdAfterExhale":
        return "radial-gradient(circle at 40% 60%, rgba(245, 158, 11, 0.3), transparent 50%), radial-gradient(circle at 90% 10%, rgba(249, 115, 22, 0.2), transparent 50%)"
      default:
        return "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2), transparent 50%)"
    }
  }

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      animate={{
        background: getPhaseGradient(),
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
    >
      {/* Floating orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-xl"
          style={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: isActive ? [0.1, 0.3, 0.1] : 0.05,
            scale: isActive ? [1, 1.2, 1] : 0.8,
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          className={
            phase === "inhale"
              ? "bg-blue-500/20"
              : phase === "hold"
                ? "bg-purple-500/20"
                : phase === "exhale"
                  ? "bg-green-500/20"
                  : "bg-orange-500/20"
          }
        />
      ))}
    </motion.div>
  )
}
