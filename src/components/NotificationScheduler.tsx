'use client'

import { useEffect } from 'react'
import { checkDailyReminder } from '@/lib/notifications'

export default function NotificationScheduler() {
  useEffect(() => {
    const check = () => {
      void checkDailyReminder()
    }

    const intervalId = window.setInterval(check, 30_000)
    document.addEventListener('visibilitychange', check)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  return null
}
