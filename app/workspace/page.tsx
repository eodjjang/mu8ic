import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WorkspaceClient } from "./workspace-client"

export default async function WorkspacePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return (
    <div className="min-h-screen bg-[#171717] font-sans text-white/90">
      <WorkspaceClient />
    </div>
  )
}
