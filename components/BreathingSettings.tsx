"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BreathingPattern } from "@/components/BreathingApp"

interface BreathingSettingsProps {
  patterns: BreathingPattern[]
  selectedPattern: BreathingPattern
  onPatternChange: (pattern: BreathingPattern) => void
  sessionDuration: number
  onSessionDurationChange: (duration: number) => void
  onClose: () => void
}

export default function BreathingSettings({
  patterns,
  selectedPattern,
  onPatternChange,
  sessionDuration,
  onSessionDurationChange,
  onClose,
}: BreathingSettingsProps) {
  const durations = [1, 2, 5, 10, 15, 20]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button onClick={onClose} variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      {/* Breathing Patterns */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Breathing Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patterns.map((pattern) => (
            <motion.div key={pattern.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onPatternChange(pattern)}
                variant={selectedPattern.name === pattern.name ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-4 ${
                  selectedPattern.name === pattern.name
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-white/5 text-white border-white/20 hover:bg-white/10"
                }`}
              >
                <div>
                  <div className="font-semibold">{pattern.name}</div>
                  <div className="text-sm opacity-80 mt-1">{pattern.description}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {pattern.inhale}s in • {pattern.hold > 0 && `${pattern.hold}s hold • `}
                    {pattern.exhale}s out{pattern.holdAfterExhale > 0 && ` • ${pattern.holdAfterExhale}s hold`}
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Session Duration */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Session Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {durations.map((duration) => (
              <Button
                key={duration}
                onClick={() => onSessionDurationChange(duration)}
                variant={sessionDuration === duration ? "default" : "outline"}
                className={
                  sessionDuration === duration
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-white/5 text-white border-white/20 hover:bg-white/10"
                }
              >
                {duration} min
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
