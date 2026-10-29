'use client'

import { useState, useEffect, useRef } from 'react'

type Phase = 'inspira' | 'segura' | 'expira' | 'pausa'

interface BreathingStep {
  phase: Phase
  label: string
  duration: number
}

const breathingSteps: BreathingStep[] = [
  { phase: 'inspira', label: 'Inspira...', duration: 4 },
  { phase: 'segura', label: 'Segura...', duration: 4 },
  { phase: 'expira', label: 'Expira...', duration: 6 },
  { phase: 'pausa', label: 'Pausa...', duration: 2 },
]

const breathingCycleSeconds = breathingSteps.reduce((total, step) => total + step.duration, 0)

interface TimerBreathingProps {
  totalSeconds: number
  onComplete: () => void
}

export default function TimerBreathing({ totalSeconds = 180, onComplete }: TimerBreathingProps) {
  const safeTotalSeconds = Number.isFinite(totalSeconds) && totalSeconds > 0
    ? Math.floor(totalSeconds)
    : 180
  const [secondsLeft, setSecondsLeft] = useState(safeTotalSeconds)
  const [stepIndex, setStepIndex] = useState(0)
  const [stepSecondsLeft, setStepSecondsLeft] = useState(breathingSteps[0].duration)
  const [isRunning, setIsRunning] = useState(true)

  const onCompleteRef = useRef(onComplete)
  const secondsLeftRef = useRef(safeTotalSeconds)
  const stepIndexRef = useRef(0)
  const stepSecondsLeftRef = useRef(breathingSteps[0].duration)
  const completionFiredRef = useRef(false)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!isRunning) return

    const interval = window.setInterval(() => {
      if (secondsLeftRef.current <= 1) {
        secondsLeftRef.current = 0
        setSecondsLeft(0)
        setIsRunning(false)

        if (!completionFiredRef.current) {
          completionFiredRef.current = true
          onCompleteRef.current()
        }
        return
      }

      const nextSecondsLeft = secondsLeftRef.current - 1
      secondsLeftRef.current = nextSecondsLeft
      setSecondsLeft(nextSecondsLeft)

      const nextStepSecondsLeft = stepSecondsLeftRef.current - 1
      if (nextStepSecondsLeft <= 0) {
        const nextIndex = (stepIndexRef.current + 1) % breathingSteps.length
        stepIndexRef.current = nextIndex
        stepSecondsLeftRef.current = breathingSteps[nextIndex].duration
        setStepIndex(nextIndex)
        setStepSecondsLeft(breathingSteps[nextIndex].duration)
      } else {
        stepSecondsLeftRef.current = nextStepSecondsLeft
        setStepSecondsLeft(nextStepSecondsLeft)
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isRunning])

  const step = breathingSteps[stepIndex]
  const progress = 1 - secondsLeft / safeTotalSeconds
  const minutes = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const timeLabel = minutes + ':' + secs.toString().padStart(2, '0')
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  const phaseColor: Record<Phase, string> = {
    inspira: '#38BDF8',
    segura: '#34D399',
    expira: '#A7B4C2',
    pausa: '#64748B',
  }

  const animationStyle = {
    animationDuration: breathingCycleSeconds + 's',
    animationPlayState: isRunning ? 'running' as const : 'paused' as const,
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="text-center">
        <p className="text-sm font-medium tracking-wide text-[#A7B4C2]">RESPIRAÇÃO GUIADA</p>
        <p className="mt-1 text-xs text-[#64748B]">Siga a esfera. Sem pressa.</p>
      </div>

      <div className="relative flex h-64 w-64 items-center justify-center" aria-label="Animação de respiração guiada">
        <div
          aria-hidden="true"
          className="respira-breathing-halo pointer-events-none absolute h-44 w-44 rounded-full"
          style={animationStyle}
        />

        <svg
          className="absolute inset-2 -rotate-90"
          width="240"
          height="240"
          viewBox="0 0 240 240"
          aria-hidden="true"
        >
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke="rgba(167,180,194,0.12)"
            strokeWidth="5"
          />
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke={phaseColor[step.phase]}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.6s ease' }}
          />
        </svg>

        <div
          data-testid="breathing-orb"
          className="respira-breathing-orb relative flex h-36 w-36 flex-col items-center justify-center rounded-full border border-[#38BDF8]/30 bg-gradient-to-br from-[#38BDF8]/20 to-[#34D399]/20"
          style={animationStyle}
        >
          <span className="text-3xl font-semibold tabular-nums tracking-tight text-[#F8FAFC]">{timeLabel}</span>
          <span aria-hidden="true" className="mt-1 text-xs text-[#A7B4C2]">{step.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-2" aria-label="Fases da respiração">
        {breathingSteps.map((breathingStep, index) => (
          <div
            key={breathingStep.phase}
            aria-label={breathingStep.label.replace('...', '')}
            aria-current={index === stepIndex ? 'step' : undefined}
            className={'h-1.5 rounded-full transition-all duration-500 ' + (
              index === stepIndex ? 'w-8' : 'w-2 bg-[#A7B4C2]/25'
            )}
            style={index === stepIndex ? { backgroundColor: phaseColor[breathingStep.phase] } : undefined}
          />
        ))}
      </div>

      <div className="px-4 text-center">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-xl font-semibold" style={{ color: phaseColor[step.phase] }}>
          {step.label}
        </p>
        <p className="mt-1 text-sm text-[#A7B4C2]">
          {stepSecondsLeft}s restantes nesta fase
        </p>
        <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-[#64748B]">
          Se segurar o ar causar desconforto, não force: respire normalmente.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsRunning(running => !running)}
        aria-pressed={!isRunning}
        aria-label={isRunning ? 'Pausar respiração guiada' : 'Retomar respiração guiada'}
        className="rounded-full border border-[rgba(56,189,248,0.2)] px-5 py-2.5 text-sm font-medium text-[#A7B4C2] transition-colors hover:border-[rgba(56,189,248,0.45)] hover:text-[#F8FAFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
      >
        {isRunning ? 'Pausar' : 'Continuar'}
      </button>
    </div>
  )
}
