"use client"

import { WorkspaceNavbar } from "@/components/workspace-navbar"
import { WorkspacePromptDock } from "@/components/workspace-prompt-input"

export function WorkspaceClient() {
  return (
    <div className="flex min-h-screen flex-col px-4 pb-44 pt-6 md:px-8 md:pb-48">
      <WorkspaceNavbar />

      <main className="mt-12 flex flex-1 flex-col items-center justify-center text-center md:mt-16">
        <h1 className="text-2xl font-medium tracking-tight text-white/95 md:text-3xl">Workspace</h1>
      </main>

      <WorkspacePromptDock />
    </div>
  )
}
