'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isStorageRecoveryRequired, loadAppData } from '@/lib/storage'

export default function StorageRecoveryGuard() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    loadAppData()
    if (isStorageRecoveryRequired() && pathname !== '/recovery') {
      router.replace('/recovery')
    }
  }, [pathname, router])

  return null
}
