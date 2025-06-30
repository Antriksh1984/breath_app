"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  velocity: { x: number; y: number }
}

interface ParticleFieldProps {
  isActive: boolean
  phase: "inhale" | "hold" | "exhale" | "holdAfterExhale"
  intensity: number
  colorClass: string
}

export default function ParticleField({ isActive, phase, intensity, colorClass }: ParticleFieldProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  const getPhaseColors = () => {
    switch (phase) {
      case "inhale":
        return ["#3b82f6", "#06b6d4", "#0ea5e9", "#1e40af"]
      case "hold":
        return ["#8b5cf6", "#ec4899", "#d946ef", "#7c3aed"]
      case "exhale":
        return ["#10b981", "#059669", "#047857", "#065f46"]
      case "holdAfterExhale":
        return ["#f59e0b", "#f97316", "#ea580c", "#dc2626"]
      default:
        return ["#3b82f6", "#06b6d4", "#0ea5e9", "#1e40af"]
    }
  }

  useEffect(() => {
    if (!isActive) {
      setParticles([])
      return
    }

    const colors = getPhaseColors()
    const particleCount = Math.floor(intensity * 20)

    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 320,
      y: Math.random() * 320,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
    }))

    setParticles(newParticles)
  }, [isActive, phase, intensity])

  const getParticleMotion = (particle: Particle) => {
    const centerX = 160
    const centerY = 160
    const distance = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2)

    switch (phase) {
      case "inhale":
        // Particles move outward
        return {
          x: particle.x + (particle.x - centerX) * 0.02 * intensity,
          y: particle.y + (particle.y - centerY) * 0.02 * intensity,
        }
      case "exhale":
        // Particles move inward
        return {
          x: particle.x - (particle.x - centerX) * 0.02 * intensity,
          y: particle.y - (particle.y - centerY) * 0.02 * intensity,
        }
      case "hold":
        // Particles orbit
        const angle = Math.atan2(particle.y - centerY, particle.x - centerX) + 0.02
        return {
          x: centerX + distance * Math.cos(angle),
          y: centerY + distance * Math.sin(angle),
        }
      default:
        return { x: particle.x, y: particle.y }
    }
  }

  if (!isActive) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={getParticleMotion(particle)}
          transition={{
            duration: 0.1,
            ease: "linear",
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
          }}
          whileInView={{
            opacity: [0, 1, 0.8, 0],
          }}
        />
      ))}
    </div>
  )
}
