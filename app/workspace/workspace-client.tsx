"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Music, Sparkles } from "lucide-react"
import { WorkspaceNavbar } from "@/components/workspace-navbar"
import { WorkspacePromptDock } from "@/components/workspace-prompt-input"
import { cn } from "@/lib/utils"

/** Skip voice placeholder; unwrap Search/Think/Canvas prefixes for the model caption. */
function promptForMusic(message: string): string | null {
  const m = message.trim()
  if (!m) return null
  if (/^\[Voice message\b/i.test(m)) return null

  const bracket = /^\[(Search|Think|Canvas):\s*([\s\S]*)\]$/i.exec(m)
  if (bracket) {
    const inner = bracket[2]?.trim()
    return inner || null
  }
  return m
}

export function WorkspaceClient() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [audioUrls, setAudioUrls] = React.useState<string[]>([])
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [errorCode, setErrorCode] = React.useState<string | null>(null)

  const handleSend = React.useCallback(async (message: string, _files?: File[]) => {
    const prompt = promptForMusic(message)
    if (!prompt) return

    setIsGenerating(true)
    setErrorMessage(null)
    setErrorCode(null)
    setAudioUrls([])

    try {
      const res = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, duration: 60 }),
      })
      const data = (await res.json()) as { urls?: string[]; error?: string; code?: string }

      if (!res.ok) {
        setErrorCode(data.code ?? null)
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      if (!data.urls?.length) {
        throw new Error("No audio URL in response")
      }
      setAudioUrls(data.urls)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong"
      setErrorMessage(msg)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const showResultCard = errorMessage !== null || audioUrls.length > 0

  return (
    <div className="flex min-h-screen flex-col px-4 pb-44 pt-6 md:px-8 md:pb-48">
      <WorkspaceNavbar />

      <main className="mt-12 flex flex-1 flex-col items-center justify-center text-center md:mt-16">
        <div
          className={cn("relative h-[72px] w-[72px] shrink-0", isGenerating ? "mb-3" : "mb-5")}
        >
          {isGenerating ? (
            <div
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-violet-400/25 border-t-violet-400 border-r-violet-300/70 shadow-[0_0_12px_rgba(139,92,246,0.35)] animate-[spin_1.15s_linear_infinite]"
              aria-hidden
            />
          ) : null}
          <div
            className={cn(
              "relative z-10 flex h-full w-full items-center justify-center rounded-full border border-violet-400/35 bg-violet-500/[0.18] shadow-[0_8px_40px_rgba(139,92,246,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl",
              isGenerating && "border-violet-400/25"
            )}
            aria-hidden
          >
            <Music className="h-9 w-9 text-violet-400" strokeWidth={1.35} />
          </div>
        </div>
        {isGenerating ? (
          <div
            className="mb-5 flex max-w-sm items-start justify-center gap-2.5 px-3 text-left sm:max-w-md"
            role="status"
            aria-live="polite"
          >
            <motion.span
              className="mt-0.5 inline-flex shrink-0 text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.65)]"
              animate={{ opacity: [0.65, 1, 0.65], scale: [0.94, 1.06, 0.94] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              <Sparkles className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
            </motion.span>
            <div className="min-w-0 font-normal">
              <p className="text-[11px] leading-snug text-white/80 md:text-xs">
                Requesting music generation from the AI.
              </p>
              <p className="mt-1.5 text-[10px] leading-snug text-white/55 md:text-[11px]">
                This may take a few minutes.
              </p>
            </div>
          </div>
        ) : null}
        {!isGenerating ? (
          <h1 className="text-2xl font-medium tracking-tight text-white/95 md:text-3xl">
            Create AI Music
          </h1>
        ) : null}
        {!isGenerating ? (
          <>
            <p className="mt-4 max-w-md px-2 text-[11px] leading-relaxed text-white/45 md:text-xs">
              Describe the style, mood, or story you want.
            </p>
            <p className="mt-1.5 max-w-md px-2 text-[11px] leading-relaxed text-white/45 md:text-xs">
              The AI creates unique music for you.
            </p>
          </>
        ) : null}

        {showResultCard ? (
          <div
            className={cn(
              "mt-8 w-full max-w-md rounded-2xl border border-white/10 bg-[#1F2023]/90 px-4 py-4 text-left shadow-lg backdrop-blur-sm"
            )}
          >
            {errorMessage ? (
              <div className="space-y-2" role="alert">
                <p className="text-sm text-red-400/95">{errorMessage}</p>
                {errorCode === "REPLICATE_INSUFFICIENT_CREDIT" ? (
                  <a
                    href="https://replicate.com/account/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-violet-400/95 underline underline-offset-2 hover:text-violet-300"
                  >
                    Replicate billing (크레딧 충전) →
                  </a>
                ) : null}
              </div>
            ) : null}

            {audioUrls.length > 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-white/40">Your track</p>
                {audioUrls.map((url, i) => (
                  <audio
                    key={`${url}-${i}`}
                    controls
                    src={url}
                    className="h-10 w-full accent-violet-500"
                    preload="metadata"
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </main>

      <WorkspacePromptDock
        onSend={handleSend}
        isLoading={isGenerating}
        placeholder="Describe your track — genre, mood, lyrics…"
      />
    </div>
  )
}
