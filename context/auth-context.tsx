"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import type { Tables } from "@/lib/database.types"

type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: Tables<"users"> | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Tables<"users"> | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase.from("users").select("*").eq("id", userId).maybeSingle()
      setProfile(data ?? null)
    },
    [supabase]
  )

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const {
        data: { session: initial },
      } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(initial)
      setUser(initial?.user ?? null)
      if (initial?.user) await loadProfile(initial.user.id)
      else setProfile(null)
      setLoading(false)
    }

    void init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (nextSession?.user) void loadProfile(nextSession.user.id)
      else setProfile(null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, loadProfile])

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/workspace")}`,
      },
    })
    if (error) throw error
  }, [supabase])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [supabase])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      loading,
      signInWithGoogle,
      signOut,
    }),
    [session, user, profile, loading, signInWithGoogle, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.")
  }
  return ctx
}
