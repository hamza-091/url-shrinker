
CREATE TABLE public.links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code TEXT NOT NULL UNIQUE,
  original_url TEXT NOT NULL,
  custom_alias BOOLEAN NOT NULL DEFAULT false,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  device_id TEXT NOT NULL
);

CREATE INDEX links_short_code_idx ON public.links(short_code);
CREATE INDEX links_device_id_idx ON public.links(device_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.links TO authenticated;
GRANT ALL ON public.links TO service_role;

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Anyone can read links (needed for redirect lookup and public stats)
CREATE POLICY "Anyone can read links" ON public.links FOR SELECT USING (true);
-- Anyone can create links (no login required)
CREATE POLICY "Anyone can create links" ON public.links FOR INSERT WITH CHECK (true);
-- Anyone can update links (needed to increment click counter)
CREATE POLICY "Anyone can update links" ON public.links FOR UPDATE USING (true) WITH CHECK (true);
-- Anyone can delete links (no auth; UI scopes deletion to current device_id)
CREATE POLICY "Anyone can delete links" ON public.links FOR DELETE USING (true);
