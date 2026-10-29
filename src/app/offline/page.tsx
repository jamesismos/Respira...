import Link from "next/link";
import { CloudOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111A] px-6 py-12 text-[#F8FAFC]">
      <section className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#38BDF8]/25 bg-[#0F1B24] text-[#38BDF8]">
          <CloudOff size={32} aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#38BDF8]">RESPIRA · MODO OFFLINE</p>
        <h1 className="mt-3 text-2xl font-bold">Sem conexão por enquanto.</h1>
        <p className="mt-3 text-sm leading-6 text-[#A7B4C2]">
          Seus registros ficam neste dispositivo. Quando a conexão voltar, você poderá continuar navegando normalmente. Respire com calma; uma vontade de cada vez.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-5 py-3 font-semibold text-white"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Tentar novamente
          </Link>
          <p className="text-xs text-[#64748B]">O exercício de respiração também pode ajudar enquanto você espera.</p>
        </div>
      </section>
    </main>
  );
}
