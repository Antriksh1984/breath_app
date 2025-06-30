"use client"

import type React from "react"
import { motion } from "framer-motion"
import DynamicShapes from "./DynamicShapes"
import ParticleField from "./ParticleField"

interface BreathingCircleProps {
  isActive: boolean
  phase: "inhale" | "hold" | "exhale" | "holdAfterExhale"
  phaseTime: number
  phaseDuration: number
  colorClass: string
}

export default function BreathingCircle({
  isActive,
  phase,
  phaseTime,
  phaseDuration,
  colorClass,
}: BreathingCircleProps) {
  const getScale = () => {
    if (!isActive) return 1

    const progress = phaseTime / phaseDuration

    switch (phase) {
      case "inhale":
        return 1 + progress * 0.8 // Scale from 1 to 1.8
      case "hold":
        return 1.8 // Stay expanded
      case "exhale":
        return 1.8 - progress * 0.8 // Scale from 1.8 to 1
      case "holdAfterExhale":
        return 1 // Stay contracted
      default:
        return 1
    }
  }

  const getOpacity = () => {
    if (!isActive) return 0.7

    const progress = phaseTime / phaseDuration

    switch (phase) {
      case "inhale":
        return 0.7 + progress * 0.3 // Opacity from 0.7 to 1
      case "hold":
        return 1 // Stay bright
      case "exhale":
        return 1 - progress * 0.3 // Opacity from 1 to 0.7
      case "holdAfterExhale":
        return 0.7 // Stay dim
      default:
        return 0.7
    }
  }

  const getRotation = () => {
    if (!isActive) return 0
    const progress = phaseTime / phaseDuration

    switch (phase) {
      case "inhale":
        return progress * 90
      case "hold":
        return 90 + progress * 90
      case "exhale":
        return 180 + progress * 90
      case "holdAfterExhale":
        return 270 + progress * 90
      default:
        return 0
    }
  }

  return (
    <div className="relative w-80 h-80">
      {/* Particle Field Background */}
      <ParticleField isActive={isActive} phase={phase} intensity={getScale()} colorClass={colorClass} />

      {/* Dynamic Shapes Layer */}
      <DynamicShapes
        isActive={isActive}
        phase={phase}
        scale={getScale()}
        opacity={getOpacity()}
        rotation={getRotation()}
        colorClass={colorClass}
      />

      {/* Central Breathing Orb */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            scale: getScale(),
            rotate: getRotation(),
          }}
          transition={{
            duration: 0.1,
            ease: "easeInOut",
          }}
        >
          {/* Main orb with complex gradient */}
          <motion.div
            className="w-32 h-32 rounded-full relative overflow-hidden"
            style={{
              background: `conic-gradient(from ${getRotation()}deg, 
                var(--gradient-start), 
                var(--gradient-mid), 
                var(--gradient-end), 
                var(--gradient-start))`,
              "--gradient-start":
                phase === "inhale"
                  ? "#3b82f6"
                  : phase === "hold"
                    ? "#8b5cf6"
                    : phase === "exhale"
                      ? "#10b981"
                      : "#f59e0b",
              "--gradient-mid":
                phase === "inhale"
                  ? "#06b6d4"
                  : phase === "hold"
                    ? "#ec4899"
                    : phase === "exhale"
                      ? "#059669"
                      : "#f97316",
              "--gradient-end":
                phase === "inhale"
                  ? "#0ea5e9"
                  : phase === "hold"
                    ? "#d946ef"
                    : phase === "exhale"
                      ? "#047857"
                      : "#ea580c",
            } as React.CSSProperties
          >
            {/* Inner glow layers */}
            <motion.div\
              className="absolute inset-2 rounded-full bg-white/20 blur-sm"
              animate={{
                opacity: getOpacity() * 0.8,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{
                scale: [1, 2, 3],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
  </div>
  )
}
