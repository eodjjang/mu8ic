import { redirect } from "next/navigation"
import { LandingHero } from "@/components/landing-hero"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    redirect("/workspace")
  }

  return (
    <main className="min-h-screen">
      <LandingHero />
    </main>
  )
}
