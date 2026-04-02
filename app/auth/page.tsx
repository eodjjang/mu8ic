import { Suspense } from "react"
import { AuthClient } from "./auth-client"

function AuthShell() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#171717] px-5 py-10 font-sans">
      <div className="w-full max-w-[320px] rounded-xl border border-white/[0.14] bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl backdrop-saturate-150">
        <p className="font-logo text-center text-xl tracking-wide text-white/95">mu8ic</p>
        <p className="mt-1.5 text-center text-xs text-white/50">Sign in to your account</p>
        <div className="mt-6 h-10 animate-pulse rounded-lg border border-white/[0.08] bg-[#1e1e1e]/80" />
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthShell />}>
      <AuthClient />
    </Suspense>
  )
}
