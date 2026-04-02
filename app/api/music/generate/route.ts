import Replicate from "replicate"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/** Replicate music generation can exceed default serverless limits on some hosts. */
export const maxDuration = 300

const ACE_STEP_MODEL =
  "visoar/ace-step-1.5:fd851baef553cb1656f4a05e8f2f8641672f10bc808718f5718b4b4bb2b07794" as const

function normalizeOutputUrls(output: unknown): string[] {
  if (output == null) return []
  const items = Array.isArray(output) ? output : [output]
  const urls: string[] = []
  for (const item of items) {
    if (item == null) continue
    if (typeof item === "string") {
      urls.push(item)
      continue
    }
    if (
      typeof item === "object" &&
      "url" in item &&
      typeof (item as { url: unknown }).url === "function"
    ) {
      const u = (item as { url: () => URL }).url()
      urls.push(u instanceof URL ? u.href : String(u))
    }
  }
  return urls
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: "Missing REPLICATE_API_TOKEN" }, { status: 500 })
  }

  let body: { prompt?: string; duration?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const raw = typeof body.prompt === "string" ? body.prompt.trim() : ""
  if (!raw) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 })
  }

  const durationRaw = body.duration
  const duration =
    typeof durationRaw === "number" &&
    Number.isFinite(durationRaw) &&
    durationRaw >= 10 &&
    durationRaw <= 240
      ? Math.floor(durationRaw)
      : 60

  const caption = raw.slice(0, 500)
  const verse = raw.slice(0, 6000)
  const lyrics = `[inst]\n(Intro matching the described mood.)\n\n[verse]\n${verse}\n`

  const replicate = new Replicate({ auth: token })

  try {
    const output = await replicate.run(ACE_STEP_MODEL, {
      input: {
        lyrics,
        caption,
        duration,
        timeout_seconds: Math.min(120, Math.max(30, Math.ceil(duration * 0.5))),
      },
    })

    const urls = normalizeOutputUrls(output)
    if (urls.length === 0) {
      return NextResponse.json({ error: "No audio output from model" }, { status: 502 })
    }

    return NextResponse.json({ urls })
  } catch (e) {
    console.error("[music/generate]", e)

    const httpStatus =
      e && typeof e === "object" && "response" in e
        ? (e as { response?: Response }).response?.status
        : undefined

    if (httpStatus === 402) {
      return NextResponse.json(
        {
          code: "REPLICATE_INSUFFICIENT_CREDIT",
          error:
            "Replicate 계정 크레딧이 부족합니다. replicate.com → Account → Billing에서 크레딧을 충전한 뒤 몇 분 뒤 다시 시도해 주세요.",
        },
        { status: 402 }
      )
    }

    const message = e instanceof Error ? e.message : "Generation failed"
    const clientStatus =
      typeof httpStatus === "number" && httpStatus >= 400 && httpStatus < 600 ? httpStatus : 502
    return NextResponse.json({ error: message }, { status: clientStatus })
  }
}
