'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Bell, CheckCircle2, Clock, ShieldCheck } from 'lucide-react'
import { getStorageError, loadAppData, saveSettings } from '@/lib/storage'
import { showLocalNotification } from '@/lib/notifications'

type PermissionState = NotificationPermission | 'unsupported'

export default function NotificationSettings() {
  const [supported, setSupported] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [permission, setPermission] = useState<PermissionState>('default')
  const [enabled, setEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState('20:00')
  const [message, setMessage] = useState('')
  const [messageIsError, setMessageIsError] = useState(false)

  useEffect(() => {
    const apiAvailable = window.isSecureContext && 'Notification' in window
    setSupported(apiAvailable)
    setInitialized(true)
    setPermission('Notification' in window ? Notification.permission : 'unsupported')

    const settings = loadAppData().settings
    setEnabled(Boolean(settings.notificationsEnabled))
    setReminderTime(settings.reminderTime || '20:00')
  }, [])

  async function toggleReminders() {
    setMessage('')
    setMessageIsError(false)

    if (enabled) {
      if (!saveSettings({ notificationsEnabled: false })) {
        setMessage(getStorageError() || 'Não foi possível salvar essa preferência.')
        setMessageIsError(true)
        return
      }
      setEnabled(false)
      setMessage('Lembretes pausados. Você pode reativá-los quando quiser.')
      return
    }

    if (!supported) {
      setMessage('Este navegador precisa oferecer notificações em uma conexão segura (HTTPS ou localhost).')
      setMessageIsError(true)
      return
    }

    if (Notification.permission === 'denied') {
      setPermission('denied')
      setMessage('As notificações estão bloqueadas pelo navegador. Altere a permissão deste site nas configurações do navegador.')
      setMessageIsError(true)
      return
    }

    const nextPermission =
      Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission()

    setPermission(nextPermission)
    if (nextPermission !== 'granted') {
      setMessage('Nenhuma notificação será enviada sem sua permissão.')
      setMessageIsError(true)
      return
    }

    if (!saveSettings({ notificationsEnabled: true, reminderTime })) {
      setMessage(getStorageError() || 'A permissão foi concedida, mas a preferência não pôde ser salva.')
      setMessageIsError(true)
      return
    }
    setEnabled(true)
    setMessage('Lembrete diário ativado neste navegador.')
    setMessageIsError(false)
  }

  function changeReminderTime(value: string) {
    const previous = reminderTime
    setReminderTime(value)
    if (!saveSettings({ reminderTime: value })) {
      setReminderTime(previous)
      setMessage(getStorageError() || 'Não foi possível salvar o horário do lembrete.')
      setMessageIsError(true)
      return
    }
    setMessage('Horário salvo neste navegador.')
    setMessageIsError(false)
  }

  async function testNotification() {
    setMessage('')
    setMessageIsError(false)
    const shown = await showLocalNotification(
      'Respira — teste de notificação',
      'Está tudo funcionando. Uma vontade de cada vez.',
      '/home',
    )
    setMessage(
      shown
        ? 'Notificação de teste enviada.'
        : 'Não foi possível exibir a notificação. Confira a permissão do navegador.',
    )
    setMessageIsError(!shown)
  }

  return (
    <section className="glass-card flex flex-col gap-4 p-4" aria-labelledby="notification-settings-title">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]">
          <Bell size={19} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="notification-settings-title" className="font-semibold text-[#F8FAFC]">
            Lembrete diário
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#A7B4C2]">
            Um lembrete discreto para fazer uma pausa e lembrar do seu motivo. Você escolhe se quer receber.
          </p>
        </div>
      </div>

      {!initialized ? (
        <p className="text-xs text-[#64748B]">Verificando suporte do navegador…</p>
      ) : !supported ? (
        <div className="flex items-start gap-2 rounded-xl bg-[#162230] p-3 text-sm text-[#A7B4C2]">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-[#FBBF24]" />
          <p>Este navegador não oferece notificações aqui. Use HTTPS e, no iPhone, pode ser necessário adicionar o Respira à Tela de Início.</p>
        </div>
      ) : null}

      {permission === 'denied' && (
        <div className="flex items-start gap-2 rounded-xl bg-[#162230] p-3 text-sm text-[#A7B4C2]">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-[#FBBF24]" />
          <p>O navegador bloqueou as notificações. Para reativar, altere a permissão deste site nas configurações do navegador.</p>
        </div>
      )}

      {enabled && (
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#07111A]/60 p-3">
          <Clock size={18} className="shrink-0 text-[#34D399]" aria-hidden="true" />
          <span className="flex-1 text-sm text-[#F8FAFC]">Horário do lembrete</span>
          <input
            type="time"
            value={reminderTime}
            onChange={event => changeReminderTime(event.target.value)}
            className="rounded-lg border border-white/10 bg-[#0F1B24] px-3 py-2 text-sm text-[#F8FAFC]"
            aria-label="Horário do lembrete diário"
          />
        </label>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={toggleReminders}
          disabled={!initialized || (!supported && !enabled)}
          className="flex-1 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-4 py-3 text-sm font-semibold text-[#07111A] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {enabled ? 'Pausar lembretes' : 'Ativar lembretes'}
        </button>
        {enabled && permission === 'granted' && (
          <button
            type="button"
            onClick={testNotification}
            className="rounded-xl border border-[rgba(56,189,248,0.25)] px-4 py-3 text-sm font-medium text-[#F8FAFC] transition-colors hover:bg-white/5"
          >
            Testar
          </button>
        )}
      </div>

      <div className="flex items-start gap-2 text-xs leading-5 text-[#64748B]">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#34D399]" aria-hidden="true" />
        <p>
          A preferência fica salva neste navegador. Sem servidor de notificações, o lembrete só pode ser verificado enquanto o Respira estiver aberto em segundo plano; o navegador não garante entrega com o app totalmente fechado.
        </p>
      </div>

      {message && (
        <p role={messageIsError ? 'alert' : 'status'} aria-live="polite" className={'flex items-center gap-2 text-sm ' + (messageIsError ? 'text-[#FDA4AF]' : 'text-[#34D399]')}>
          {messageIsError ? <AlertCircle size={16} aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}
          {message}
        </p>
      )}
    </section>
  )
}
