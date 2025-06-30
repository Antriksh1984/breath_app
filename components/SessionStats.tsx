"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface SessionStatsProps {
  totalTime: number
  breathCount: number
  sessionDuration: number
}

export default function SessionStats({ totalTime, breathCount, sessionDuration }: SessionStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = Math.min((totalTime / (sessionDuration * 60)) * 100, 100)

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardContent className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{formatTime(totalTime)}</div>
            <div className="text-sm text-white/60">Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{breathCount}</div>
            <div className="text-sm text-white/60">Breaths</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
