'use client'

import { useEffect } from 'react'

export default function RootPage() {
  useEffect(() => {
    document.title = 'Respira — Projeto encerrado'
  }, [])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07111A] px-5 py-12 text-[#F8FAFC]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#38BDF8]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-[#34D399]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#A7B4C2 0.7px, transparent 0.7px)', backgroundSize: '22px 22px' }} />
      </div>

      <section className="relative w-full max-w-2xl animate-float-up">
        <div className="mb-8 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/respira_app_icon.png"
            alt=""
            className="h-12 w-12 rounded-2xl border border-white/10"
          />
          <div>
            <p className="text-lg font-semibold tracking-tight">Respira</p>
            <p className="text-xs tracking-[0.18em] text-[#A7B4C2] uppercase">Encerramento do projeto</p>
          </div>
        </div>

        <div className="glass-card p-7 sm:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/25 bg-[#FBBF24]/10 px-3 py-1.5 text-sm text-[#FCD34D]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#FBBF24]" />
            Projeto descontinuado
          </div>

          <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Este projeto chega ao <span className="gradient-text">fim de seu ciclo.</span>
          </h1>

          <div className="mt-6 space-y-4 text-base leading-7 text-[#A7B4C2] sm:text-lg">
            <p>
              O Respira foi criado com um propósito específico, mas a solução desenvolvida
              não atendeu ao objetivo esperado e não foi aprovada pela cliente.
            </p>
            <p>
              Por esse motivo, o desenvolvimento será descontinuado e o projeto não receberá
              novas funcionalidades nem manutenção contínua.
            </p>
          </div>

          <div className="my-8 h-px bg-white/10" />

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#38BDF8]" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 3.5 14.5 9.5 20.5 12 14.5 14.5 12 20.5 9.5 14.5 3.5 12 9.5 9.5 12 3.5Z" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="font-medium text-[#F8FAFC]">Obrigado por conhecer o projeto.</h2>
              <p className="mt-1 text-sm leading-6 text-[#A7B4C2]">
                A experiência faz parte do processo de criação: nem toda solução chega ao
                resultado pretendido, e reconhecer isso também é seguir em frente.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-6 flex flex-col gap-2 text-xs text-[#718096] sm:flex-row sm:items-center sm:justify-between">
          <span>Respira · Projeto independente</span>
          <span>Desenvolvimento encerrado</span>
        </footer>
      </section>
    </main>
  )
}
