'use client'

import { useEffect, useState, useCallback } from 'react'
import { loadAppData, getBestStreakDays } from '@/lib/storage'
import {
  calculateSmokeFreeSeconds,
  calculateMoneySaved,
  calculateCigarettesAvoided,
  formatCurrency,
  formatSmokeFreeTime,
} from '@/lib/stats'
import type { UserProfile, CravingLog } from '@/types'
import { defaultTriggers } from '@/data/triggers'
import { localDateKey } from '@/lib/dates'
import BottomNav from '@/components/BottomNav'
import StatCard from '@/components/StatCard'
import { BarChart2, Trophy, TrendingUp, Zap, Target } from 'lucide-react'

export default function ProgressPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState({
    days: 0, hours: 0,
    moneySaved: 0,
    cigarettesAvoided: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalCravings: 0,
    totalResisted: 0,
  })
  const [topTriggers, setTopTriggers] = useState<{ id: string; label: string; emoji: string; count: number }[]>([])
  const [last14Days, setLast14Days] = useState<{ label: string; resisted: number; relapsed: number }[]>([])

  const refresh = useCallback(() => {
    const data = loadAppData()
    if (!data.profile) return
    const p = data.profile
    setProfile(p)

    const secs = calculateSmokeFreeSeconds(p.lastSmoked)
    const time = formatSmokeFreeTime(secs)
    const best = getBestStreakDays()

    setStats({
      days: time.days,
      hours: time.hours,
      moneySaved: calc¶»§q«^