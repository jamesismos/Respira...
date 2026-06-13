'use client'

import { useEffect, useState } from 'react'
import { motivationalPhrases } from '@/data/phrases'

interface MotivationalPhraseProps {
  interval?: number // ms to rotate
  className?: string
}

export default function MotivationalPhrase({
  interval = 8000,
  className = '',
}: MotivationalPhraseProps) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * motivationalPhrases.length))
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % motivationalPhrases.length)
        setVisible(true)
      }, 400)
    }, interval)
    return () => clearInterval(timer)
  }, [interval])

  return (
    <p
      className={`text-center text-[#F8FAFC] font-medium leading-relaxed transition-opacity duration-400 ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      "{motivationalPhrases[index]}"
    </p>
  )
}
