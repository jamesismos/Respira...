'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadAppData } from '@/lib/storage'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const data = loadAppData()
    if (data.settings.hasCompletedOnboarding && data.profile) {
      router.replace('/home')
    } else {
      router.replace('/onboarding')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#07111A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/respira_app_icon.png"
          alt="Respira"
          className="w-20 h-20 rounded-3xl animate-pulse"
        />
        <p className="text-[#A7B4C2] text-sm">carregando...</p>
      </div>
    </div>
  )
}
