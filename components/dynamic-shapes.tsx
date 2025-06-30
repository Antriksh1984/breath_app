"use client"

import { motion } from "framer-motion"

interface DynamicShapesProps {
  isActive: boolean
  phase: "inhale" | "hold" | "exhale" | "holdAfterExhale"
  scale: number
  opacity: number
  rotation: number
  colorClass: string
}

export function DynamicShapes({ isActive, phase, scale, opacity, rotation, colorClass }: DynamicShapesProps) {
  const shapes = [
    { size: 60, delay: 0, type: "triangle" },
    { size: 80, delay: 0.5, type: "hexagon" },
    { size: 100, delay: 1, type: "pentagon" },
    { size: 120, delay: 1.5, type: "octagon" },
  ]

  const getShapeColor = (index: number) => {
    const colors = {
      inhale: ["#3b82f6", "#06b6d4", "#0ea5e9", "#1d4ed8"],
      hold: ["#8b5cf6", "#ec4899", "#d946ef", "#7c3aed"],
      exhale: ["#10b981", "#059669", "#047857", "#065f46"],
      holdAfterExhale: ["#f59e0b", "#f97316", "#ea580c", "#dc2626"],
    }
    return colors[phase][index % colors[phase].length]
  }

  const createShapePath = (type: string, size: number) => {
    const radius = size / 2
    const center = size / 2

    switch (type) {
      case "triangle":
        return `M ${center} ${center - radius} L ${center + radius * 0.866} ${center + radius * 0.5} L ${center - radius * 0.866} ${center + radius * 0.5} Z`
      case "hexagon":
        const hexPoints = []
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3
          const x = center + radius * Math.cos(angle)
          const y = center + radius * Math.sin(angle)
          hexPoints.push(`${i === 0 ? "M" : "L"} ${x} ${y}`)
        }
        return hexPoints.join(" ") + " Z"
      case "pentagon":
        const pentPoints = []
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
          const x = center + radius * Math.cos(angle)
          const y = center + radius * Math.sin(angle)
          pentPoints.push(`${i === 0 ? "M" : "L"} ${x} ${y}`)
        }
        return pentPoints.join(" ") + " Z"
      case "octagon":
        const octPoints = []
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4
          const x = center + radius * Math.cos(angle)
          const y = center + radius * Math.sin(angle)
          octPoints.push(`${i === 0 ? "M" : "L"} ${x} ${y}`)
        }
        return octPoints.join(" ") + " Z"
      default:
        return ""
    }
  }

  if (!isActive) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute"
          animate={{
            scale: scale * (1 + index * 0.1),
            rotate: rotation + index * 45,
            opacity: opacity * (0.3 - index * 0.05),
          }}
          transition={{
            duration: 0.1,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        >
          <svg width={shape.size} height={shape.size} className="overflow-visible">
            <defs>
              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={getShapeColor(index)} stopOpacity="0.8" />
                <stop offset="50%" stopColor={getShapeColor((index + 1) % 4)} stopOpacity="0.6" />
                <stop offset="100%" stopColor={getShapeColor((index + 2) % 4)} stopOpacity="0.4" />
              </linearGradient>
              <filter id={`glow-${index}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d={createShapePath(shape.type, shape.size)}
              fill={`url(#gradient-${index})`}
              filter={`url(#glow-${index})`}
              animate={{
                pathLength: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: shape.delay,
              }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
