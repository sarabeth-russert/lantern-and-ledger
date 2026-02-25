import { getRoomBySlug } from '@/lib/constants/rooms'

// ─── Provider auto-detection ──────────────────────────────────────────────────
// Set ONE of these in .env.local:
//
//   GROQ_API_KEY=...        → free tier at console.groq.com  (recommended)
//   ANTHROPIC_API_KEY=...   → paid at platform.claude.com
//   OLLAMA_BASE_URL=http://localhost:11434  → fully local, no account needed
//
// Priority: Groq → Anthropic → Ollama

type Message = { role: 'user' | 'assistant'; content: string }

// ─── Groq (free tier) ─────────────────────────────────────────────────────────
async function streamGroq(systemPrompt: string, messages: Message[]): Promise<ReadableStream> {
  const Groq = (await import('groq-sdk')).default
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const stream = groq.chat.completions.stream({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
  })

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(new TextEncoder().encode(text))
        }
      } finally {
        controller.close()
      }
    },
  })
}

// ─── Anthropic / Claude (paid) ────────────────────────────────────────────────
async function streamAnthropic(systemPrompt: string, messages: Message[]): Promise<ReadableStream> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    },
  })
}

// ─── Ollama (fully local, no account needed) ──────────────────────────────────
async function streamOllama(systemPrompt: string, messages: Message[]): Promise<ReadableStream> {
  const base = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
  const model = process.env.OLLAMA_MODEL ?? 'llama3.2'

  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  })

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`)

  // Ollama streams NDJSON — one JSON object per line
  return new ReadableStream({
    async start(controller) {
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.trim()) continue
            try {
              const obj = JSON.parse(line)
              const text = obj.message?.content ?? ''
              if (text) controller.enqueue(new TextEncoder().encode(text))
            } catch { /* skip malformed lines */ }
          }
        }
      } finally {
        controller.close()
      }
    },
  })
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  let body: { roomSlug: string; messages: Message[] }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { roomSlug, messages } = body
  const room = getRoomBySlug(roomSlug)
  if (!room) return new Response('Unknown room', { status: 400 })

  const validMessages = messages.filter((m) => m.content.trim())

  // Pick provider
  const hasGroq      = !!process.env.GROQ_API_KEY
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY
  const hasOllama    = !!process.env.OLLAMA_BASE_URL

  if (!hasGroq && !hasAnthropic && !hasOllama) {
    return new Response(
      'No AI provider configured. Add one of these to .env.local:\n' +
      '  GROQ_API_KEY=...         (free at console.groq.com)\n' +
      '  ANTHROPIC_API_KEY=...    (paid at platform.claude.com)\n' +
      '  OLLAMA_BASE_URL=http://localhost:11434  (local, free)',
      { status: 503 }
    )
  }

  try {
    const stream = hasGroq
      ? await streamGroq(room.systemPrompt, validMessages)
      : hasAnthropic
      ? await streamAnthropic(room.systemPrompt, validMessages)
      : await streamOllama(room.systemPrompt, validMessages)

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(`Lantern error: ${message}`, { status: 500 })
  }
}
