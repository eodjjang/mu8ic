"use client"

import type { User } from "@supabase/supabase-js"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

function avatarUrlFromUser(user: User | null) {
  if (!user) return null
  const meta = user.user_metadata as Record<string, string | undefined> | undefined
  return meta?.avatar_url ?? meta?.picture ?? null
}

function initialsFromEmail(email: string | null | undefined) {
  if (!email) return "?"
  const local = email.split("@")[0] ?? ""
  return local.slice(0, 2).toUpperCase() || "?"
}

export function WorkspaceNavbar({ className }: { className?: string }) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const avatarUrl = avatarUrlFromUser(user)
  const email = user?.email ?? null

  async function handleSignOut() {
    await signOut()
    router.replace("/")
  }

  return (
    <nav
      className={cn(
        "w-full bg-transparent",
        className
      )}
    >
      <div className="flex w-full items-center gap-3 bg-transparent py-1 pl-0 pr-0">
        <a
          href="/workspace"
          className="font-logo shrink-0 text-lg tracking-wide text-white/95 transition-opacity hover:opacity-90"
        >
          mu8ic
        </a>

        <div className="mx-auto flex min-w-0 flex-1 justify-center px-2 sm:px-6">
          <label className="relative w-full max-w-md">
            <span className="sr-only">Search</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden
            />
            <input
              type="search"
              name="workspace-search"
              readOnly
              placeholder="Search…"
              className={cn(
                "w-full cursor-default rounded-2xl border-none py-2.5 pl-9 pr-4 text-sm text-white/90 outline-none",
                "bg-gradient-to-b from-white/[0.12] to-white/[0.04] backdrop-blur-2xl backdrop-saturate-150",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_32px_rgba(0,0,0,0.25)]",
                "placeholder:text-white/40",
                "focus-visible:ring-2 focus-visible:ring-white/25"
              )}
            />
          </label>
        </div>

        <div className="group relative shrink-0">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/25 ring-offset-2 ring-offset-transparent transition-[box-shadow,transform] hover:ring-white/40 hover:brightness-110 active:scale-[0.98]"
            aria-haspopup="menu"
            aria-label="사용자 메뉴"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-white/15 text-xs font-medium text-white/90">
                {initialsFromEmail(email)}
              </span>
            )}
          </button>

          <div
            className={cn(
              "invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition-all duration-200",
              "group-hover:visible group-hover:opacity-100",
              "group-focus-within:visible group-focus-within:opacity-100",
              "pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto"
            )}
            role="menu"
          >
            <div className="min-w-[10rem] rounded-xl border border-white/10 bg-[#171717]/90 p-1 shadow-lg backdrop-blur-sm">
              <button
                type="button"
                role="menuitem"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/85 transition-colors hover:bg-white/[0.08] hover:text-white"
                onClick={() => void handleSignOut()}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
