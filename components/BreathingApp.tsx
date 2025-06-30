"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Square, Settings } from "lucide-react"
import BreathingCircle from "@/components/BreathingCircle"
import BreathingSettings from "@/components/BreathingSettings"
import SessionStats from "@/components/SessionStats"
import AmbientBackground from "@/components/AmbientBackground"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export type BreathingPattern = {
  name: string
  inhale: number
  hold: number
  exhale: number
  holdAfterExhale: number
  description: string
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: "Calm Breathing",
    inhale: 4,
    hold: 0,
    exhale: 4,
    holdAfterExhale: 0,
    description: "Simple 4-4 breathing for relaxation",
  },
  {
    name: "Box Breathing",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    description: "Navy SEAL technique for focus and calm",
  },
  {
    name: "4-7-8 Breathing",
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdAfterExhale: 0,
    description: "Dr. Weil's technique for better sleep",
  },
  {
    name: "Energizing Breath",
    inhale: 3,
    hold: 0,
    exhale: 3,
    holdAfterExhale: 0,
    description: "Quick breathing for energy boost",
  },
]

export default function BreathingApp() {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "holdAfterExhale">("inhale")
  const [phaseTime, setPhaseTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0])
  const [showSettings, setShowSettings] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(5) // minutes

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const currentPhaseDuration = selectedPattern[currentPhase]

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setPhaseTime((prev) => {
          const newTime = prev + 0.1
          if (newTime >= currentPhaseDuration) {
            // Move to next phase
            setCurrentPhase((prevPhase) => {
              switch (prevPhase) {
                case "inhale":
                  return selectedPattern.hold > 0 ? "hold" : "exhale"
                case "hold":
                  return "exhale"
                case "exhale":
                  if (selectedPattern.holdAfterExhale > 0) {
                    return "holdAfterExhale"
                  } else {
                    setBreathCount((prev) => prev + 1)
                    return "inhale"
                  }
                case "holdAfterExhale":
                  setBreathCount((prev) => prev + 1)
                  return "inhale"
                default:
                  return "inhale"
              }
            })
            return 0
          }
          return newTime
        })

        setTotalTime((prev) => prev + 0.1)
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, currentPhaseDuration, selectedPattern])

  // Auto-stop after session duration
  useEffect(() => {
    if (totalTime >= sessionDuration * 60 && isActive) {
      handleStop()
    }
  }, [totalTime, sessionDuration, isActive])

  const handleStart = () => {
    setIsActive(true)
    startTimeRef.current = Date.now()
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleStop = () => {
    setIsActive(false)
    setCurrentPhase("inhale")
    setPhaseTime(0)
    setTotalTime(0)
    setBreathCount(0)
  }

  const getPhaseText = () => {
    switch (currentPhase) {
      case "inhale":
        return "Breathe In"
      case "hold":
        return "Hold"
      case "exhale":
        return "Breathe Out"
      case "holdAfterExhale":
        return "Hold"
      default:
        return "Breathe In"
    }
  }

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "inhale":
        return "from-blue-400 to-cyan-400"
      case "hold":
        return "from-purple-400 to-pink-400"
      case "exhale":
        return "from-green-400 to-emerald-400"
      case "holdAfterExhale":
        return "from-orange-400 to-yellow-400"
      default:
        return "from-blue-400 to-cyan-400"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Dynamic ambient background */}
      <AmbientBackground isActive={isActive} phase={currentPhase} />

      <div className="w-full max-w-md mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <BreathingSettings
              key="settings"
              patterns={breathingPatterns}
              selectedPattern={selectedPattern}
              onPatternChange={setSelectedPattern}
              sessionDuration={sessionDuration}
              onSessionDurationChange={setSessionDuration}
              onClose={() => setShowSettings(false)}
            />
          ) : (
            <motion.div
              key="breathing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <motion.h1
                  className="text-4xl font-bold text-white"
                  animate={{
                    textShadow: isActive ? "0 0 20px rgba(255,255,255,0.5)" : "none",
                  }}
                >
                  Breathe
                </motion.h1>
                <p className="text-blue-200">{selectedPattern.name}</p>
              </div>

              {/* Main Breathing Circle */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
                <CardContent className="p-8">
                  <div className="relative flex items-center justify-center h-80">
                    <BreathingCircle
                      isActive={isActive}
                      phase={currentPhase}
                      phaseTime={phaseTime}
                      phaseDuration={currentPhaseDuration}
                      colorClass={getPhaseColor()}
                    />

                    {/* Phase Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                      <motion.h2
                        key={currentPhase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white mb-4 drop-shadow-lg"
                        style={{
                          textShadow: "0 0 20px rgba(0,0,0,0.5)",
                        }}
                      >
                        {getPhaseText()}
                      </motion.h2>
                      <motion.div
                        className="text-5xl font-bold text-white/90 drop-shadow-lg"
                        animate={{
                          scale: isActive ? [1, 1.1, 1] : 1,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        {Math.ceil(currentPhaseDuration - phaseTime)}
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Stats */}
              <SessionStats totalTime={totalTime} breathCount={breathCount} sessionDuration={sessionDuration} />

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                {!isActive ? (
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}

                <Button
                  onClick={handleStop}
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </Button>

                <Button
                  onClick={() => setShowSettings(true)}
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
