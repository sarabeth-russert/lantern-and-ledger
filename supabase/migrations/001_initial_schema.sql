-- ─────────────────────────────────────────────────────────────────────────────
-- Lantern & Ledger — Initial Schema
-- Run this in your Supabase project SQL editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Rooms ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rooms (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug         TEXT NOT NULL,
  display_name TEXT NOT NULL,
  icon         TEXT,
  color_key    TEXT NOT NULL DEFAULT 'banjo',
  sort_order   INT  DEFAULT 0,
  is_visible   BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- ─── Ledger Entries ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ledger_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_type  TEXT NOT NULL CHECK (entry_type IN ('notes', 'goals', 'plans')),
  title       TEXT,
  body        TEXT,
  is_pinned   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tasks ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id      UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  notes        TEXT,
  is_complete  BOOLEAN DEFAULT FALSE,
  due_date     DATE,
  sort_order   INT  DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ─── Schedule Blocks ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS schedule_blocks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id        UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  day_of_week    INT  CHECK (day_of_week BETWEEN 0 AND 6),
  scheduled_date DATE,
  start_time     TIME,
  end_time       TIME,
  is_recurring   BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Lantern Messages ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lantern_messages (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id   UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role      TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Auto-update updated_at ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER ledger_updated_at
  BEFORE UPDATE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms            ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE lantern_messages ENABLE ROW LEVEL SECURITY;

-- Policies: users only see/modify their own data
CREATE POLICY "own_profile"   ON profiles         USING (id = auth.uid());
CREATE POLICY "own_rooms"     ON rooms             USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_ledger"    ON ledger_entries    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_tasks"     ON tasks             USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_schedule"  ON schedule_blocks   USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own_lantern"   ON lantern_messages  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ─── Seed Rooms for New Users ──────────────────────────────────────────────────
-- Call this function after first login to populate default rooms
CREATE OR REPLACE FUNCTION seed_default_rooms(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO rooms (user_id, slug, display_name, icon, color_key, sort_order) VALUES
    (p_user_id, 'banjo',   'Banjo',   '🪕', 'banjo',   0),
    (p_user_id, 'garden',  'Garden',  '🌿', 'garden',  1),
    (p_user_id, 'school',  'School',  '📖', 'school',  2),
    (p_user_id, 'work',    'Work',    '🖋️', 'work',    3),
    (p_user_id, 'finance', 'Finance', '⚖️', 'finance', 4),
    (p_user_id, 'workout', 'Workout', '🏹', 'workout', 5)
  ON CONFLICT (user_id, slug) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
