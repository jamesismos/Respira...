'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadAppData } from '@/lib/storage'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const data = loadAppData()
    const destination =
      data.settings.hasCompletedOnboarding && data.profile ? '/home' : '/onboarding'
    router.replace(destination)
  }, [router])

  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#07111A] px-6 text-center text-[#F8FAFC]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/respira_app_icon.png"
        alt=""
        className="h-20 w-20 rounded-3xl"
      />
      <h1 className="text-3xl font-bold gradient-text">Respira.</h1>
      <p className="text-sm text-[#A7B4C2]">Uma vontade de cada vez.</p>
      <span className="mt-2 h-5 w-5 animate-spin rounded-full border-2 border-[#38BDF8]/30 border-t-[#34D399]" />
      <p className="text-xs text-[#64748B]">Abrindo seu espaço...</p>
    </main>
  )
}
