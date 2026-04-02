"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function AuthClient() {
  const { signInWithGoogle, loading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const urlError = searchParams.get("error")

  useEffect(() => {
    if (!loading && user) {
      router.replace("/")
    }
  }, [loading, user, router])

  async function handleGoogle() {
    setError(null)
    setPending(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError(e instanceof Error ? e.message : "로그인에 실패했습니다.")
    } finally {
      setPending(false)
    }
  }

  const displayError = error ?? (urlError ? decodeURIComponent(urlError) : null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#171717] px-5 py-10 font-sans">
      <div className="w-full max-w-[320px] rounded-xl border border-white/[0.14] bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl backdrop-saturate-150">
        <p className="font-logo text-center text-xl tracking-wide text-white/95">mu8ic</p>
        <p className="mt-1.5 text-center text-xs text-white/50">Sign in to your account</p>

        {displayError ? (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-xs text-red-200/90">
            {displayError}
          </p>
        ) : null}

        <div className="mt-6">
          <button
            type="button"
            disabled={loading || pending}
            onClick={() => void handleGoogle()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-[#1e1e1e] px-4 py-2.5 text-sm font-medium tracking-tight text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:border-white/[0.16] hover:bg-[#262626] active:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleMark className="h-4 w-4 shrink-0" />
            <span>{pending ? "Redirecting…" : "Continue with Google"}</span>
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] leading-snug text-white/40">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
