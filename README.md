# Lantern & Ledger

A personal life management app organized around *Rooms* — themed spaces for the different domains of your life. Built for focus, reflection, and a little bit of magic.

---

## What It Is

Lantern & Ledger is a single-user productivity and goal-tracking app with a dark fantasy aesthetic. Instead of a dashboard, you navigate a cinematic hallway and enter rooms — each one a dedicated space for a different part of your life.

Each room contains:
- **The Lantern** — an AI assistant (powered by Claude) with a personality tuned to that room's context
- **Task Board** — a lightweight kanban for room-specific tasks
- **The Ledger** — notes, goals, and plans
- **Day Table** — a daily schedule block planner

---

## The Rooms

| Room | Slug | Theme |
|------|------|-------|
| Banjo Hollow | `banjo` | A luthier's workshop — music practice and creative projects |
| Potting Shed | `garden` | A mossy greenhouse — gardening, nature, slow living |
| Scholar's Den | `school` | A candlelit library — studying and learning |
| Workhall | `work` | An alchemist's laboratory — professional work and deep focus |
| Counting Room | `finance` | A stone treasury — budgeting and financial goals |
| Training Yard | `workout` | A castle armory — fitness and physical training |

---

## Style & Theming

The app uses a **dark fantasy / immersive sim** aesthetic inspired by games like *Dishonored* and *Dark Messiah of Might & Magic*.

### Visual Language
- **Landing page**: A first-person cinematic hallway with scroll-driven zoom, roiling fog, animated lantern sconces, and door hotspots that glow on hover
- **Room pages**: Full-bleed AI-illustrated backgrounds per room with frosted glass panels floating in front of the scene
- **Panels**: Semi-transparent (`rgba` + `backdrop-filter: blur`) so the background illustration always breathes through

### Typography
- **Cinzel Decorative** — hall and room titles (fantasy quest feel)
- **Lora** — serif body headlines
- **Inter** — UI body text

### Color Palette
- Base background: `#0a0806` (deep charcoal)
- Parchment text: `#f2e8d5`
- Each room has its own `bgColor` and `glowColor` used for accents, hotspot glows, and atmospheric lighting

| Room | Glow Color |
|------|-----------|
| banjo | `#c9845a` (warm amber) |
| garden | `#7ab87a` (moss green) |
| school | `#7a9cc9` (cool blue) |
| work | `#9a7ab8` (amethyst) |
| finance | `#5aab9c` (dark teal) |
| workout | `#c97a7a` (ember red) |

### Assets
All background illustrations are hand-prompted in ChatGPT and stored in:
- `public/hall/` — hallway scene images and vignette
- `public/rooms/` — per-room background illustrations (`[slug]-bg.png`)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase Auth (single-user) |
| AI | Anthropic Claude API (streamed) |

---

## Setup

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/lanternAndLedger.git
cd lanternAndLedger
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> **Demo mode**: If the Supabase variables are absent, the app runs with rich mock data — no database required to explore the UI.

### 3. Database

Run the migration against your Supabase project:

```bash
# Using the Supabase CLI
supabase db push

# Or paste the contents of supabase/migrations/001_initial_schema.sql
# directly into the Supabase SQL editor
```

The schema creates: `profiles`, `rooms`, `ledger_entries`, `tasks`, `schedule_blocks`, `lantern_messages` — all with Row Level Security policies scoped to the authenticated user.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Walk the hallway, scroll to zoom in, hover the doors, enter a room.

---

## Project Structure

```
app/
  page.tsx                  # Landing page — cinematic hallway
  rooms/[roomSlug]/
    page.tsx                # Room page with illustrated background
  api/lantern/route.ts      # Claude streaming endpoint

components/
  hall/
    HallwayScene.tsx        # Scroll zoom, background, sconces, hotspots
    HallwayDoor.tsx         # Invisible hotspot buttons with glow-on-hover
    FogWisps.tsx            # Roiling fog animation at vanishing point
    DustParticles.tsx       # Floating dust motes
  room/
    LanternPanel.tsx        # AI chat panel
    TaskBoard.tsx           # Kanban task board
    LedgerPanel.tsx         # Notes / goals / plans
    DayTable.tsx            # Daily schedule blocks
  ui/
    ParchmentCard.tsx       # Universal frosted panel wrapper
    RoomHeader.tsx          # Room title + back navigation

lib/
  constants/rooms.ts        # Room definitions — single source of truth
  motion.ts                 # Shared Framer Motion variants
  hooks/                    # useTasks, useLedger, useDayTable

public/
  hall/                     # Hallway illustration assets
  rooms/                    # Per-room background illustrations
```

---

## Generating Your Own Room Backgrounds

The room illustrations were generated in ChatGPT using the **Landscape (Wide)** format. Each prompt follows this structure:

```
A [room description], first-person camera perspective, [lighting],
[key props and details], [color palette], Dishonored / Dark Messiah
video game aesthetic. Ultra-detailed painterly realism. Dark moody
atmosphere. No people.
```

Save the output as `public/rooms/[slug]-bg.png` and it will automatically appear as that room's background.

---

## License

Personal use. Not licensed for redistribution.
