import { loadAppData, saveSettings } from '@/lib/storage'

const DEFAULT_REMINDER_TIME = '20:00'
let reminderInFlight = false

function localDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function showLocalNotification(
  title: string,
  body: string,
  url = '/home',
): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission !== 'granted') return false

  const options: NotificationOptions = {
    body,
    icon: '/icons/respira_app_icon.png',
    badge: '/icons/respira_app_icon.png',
    tag: 'respira-reminder',
    data: { url },
  }

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.showNotification(title, options)
        return true
      }
    }
  } catch {
    // Alguns navegadores não conseguem exibir notificações pelo service worker.
  }

  try {
    const notification = new Notification(title, options)
    notification.onclick = () => {
      window.focus()
      window.location.assign(url)
      notification.close()
    }
    return true
  } catch {
    return false
  }
}

export async function checkDailyReminder(): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (document.visibilityState !== 'hidden' || Notification.permission !== 'granted') return

  const data = loadAppData()
  const settings = data.settings
  if (!data.profile || !settings.notificationsEnabled || reminderInFlight) return

  const reminderTime = settings.reminderTime || DEFAULT_REMINDER_TIME
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(reminderTime)
  if (!match) return

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const targetMinutes = Number(match[1]) * 60 + Number(match[2])
  const minutesAfterReminder = currentMinutes - targetMinutes

  // Uma janela curta evita lembretes atrasados muitas horas depois do horário escolhido.
  if (minutesAfterReminder < 0 || minutesAfterReminder >= 10) return

  const today = localDateKey(now)
  if (settings.lastReminderDate === today) return

  reminderInFlight = true
  try {
    const shown = await showLocalNotification(
      'Respira',
      'Uma pausa para você: como está sua vontade agora? Uma vontade de cada vez.',
      '/home',
    )
    if (shown) saveSettings({ lastReminderDate: today })
  } finally {
    reminderInFlight = false
  }
}
