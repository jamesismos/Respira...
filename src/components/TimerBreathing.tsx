'use client'

import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'

type Phase = 'inspira' | 'segura' | 'expira' | 'pausa'

interface BreathingStep {
  phase: Phase
  label: string
  duration: number // seconds
  scale: number
}

const breathingSteps: BreathingStep[] = [
  { phase: 'inspira', label: 'Inspira...', duration: 4, scale: 1.3 },
  { phase: 'segura', label: 'Segura...', duration: 4, scale: 1.3 },
  { phase: 'expira', label: 'Expira...', duration: 6, scale: 1.0 },
  { phase: 'pausa', label: 'Pausa...', duration: 2, scale: 1.0 },
]

interface TimerBreathingProps {
  totalSeconds: number // default 180 (3 min)
  onComplete: () => void
}

export default function TimerBreathing({ totalSeconds = 180, onComplete }: TimerBreathingProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [stepIndex, setStepIndex] = useState(0)
  const [stepSecondsLeft, setStepSecondsLeft] = useState(breathingSteps[0].duration)
  const [isRunning, setIsRunning] = useState(true)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const step = breathingSteps[stepIndex]
  const progress = 1 - secondsLeft / totalSeconds

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(interval)
          onCompleteRef.current()
          return 0
        }
        return s - 1
      })

      setStepSecondsLeft(s => {
        if (s <= 1) {
          setStepIndex(i => (i + 1) % breathingSteps.length)
          return breathingSteps[(stepIndex + 1) % breathingSteps.length].duration
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, stepIndex])

  const minutes = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const timeLabel = `${minutes}:${secs.toString().padStart(2, '0')}`

  // SVG circle progress
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  const phaseColor: Record<Phase, string> = {
    inspira: '#38BDF8',
    segura: '#34D399',
    expira: '#A7B4C2',
    pausa: '#64748B',
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Circle timer */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="208" height="208" viewBox="0 0 208 208">
          {/* Track */}
          <circle
            cx="104" cy="104" r={radius}
            fill="none"
            stroke="rgba(167,180,194,0.15)"
            strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx="104" cy="104" r={radius}
            fill="none"
            stroke={phaseColor[step.phase]}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
        </svg>

        {/* Inner breathing circle */}
        <div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-[#38BDF8]/20 to-[#34D399]/20 border border-[#38BDF8]/30 flex flex-col items-center justify-center transition-transform duration-1000"
          style={{ transform: `scale(${step.scale})` }}
        >
          <span className="text-2xl font-bold text-[#F8FAFC] tabular-nums">{timeLabel}</span>
          <span className="text-xs text-[#A7B4C2] mt-0.5">{step.label}</span>
        </div>
      </div>

      {/* Step progress dots */}
      <div className="flex gap-2">
        {breathingSteps.map((s, i) => (
          <div
            key={s.phase}
            className={clsx(
              'rounded-full transition-all duration-300',
              i === stepIndex
                ? 'w-6 h-2 bg-[#38BDF8]'
                : 'w-2 h-2 bg-[#A7B4C2]/30'
            )}
          />
        ))}
      </div>

      {/* Instruction */}
      <div className="text-center px-6">
        <p className="text-[#F8FAFC] text-lg font-medium" style={{ color: phaseColor[step.phase] }}>
          {step.label}
        </p>
        <p className="text-[#A7B4C2] text-sm mt-1">
          {stepSecondsLeft}s restantes nessa fase
        </p>
      </div>

      {/* Pause/Resume */}
      <button
        onClick={() => setIsRunning(r => !r)}
        className="text-[#A7B4C2] text-sm underline underline-offset-4 hover:text-[#F8FAFC] transition-colors"
      >
        {isRunning ? 'pausar' : 'continuar'}
      </button>
    </div>
  )
}
