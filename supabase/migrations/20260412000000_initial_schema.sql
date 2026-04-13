-- =============================================================
-- Push — Phase 1 Database Schema
-- Target: Supabase (PostgreSQL 15+)
-- Uses gen_random_uuid() — no extensions needed
-- =============================================================


-- =============================================================
-- 1. users
-- Extends Supabase auth.users (1:1 profile mirror).
-- RLS: user can only read/write their own row (auth.uid() = id).
-- INSERT is handled by handle_new_user trigger only.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('creator', 'merchant')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS
  'Mirror of auth.users with app-level role. Created by trigger on auth.users INSERT.';


-- =============================================================
-- 2. creators
-- =============================================================
CREATE TABLE IF NOT EXISTS public.creators (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  instagram_handle TEXT,
  location         TEXT,
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  bio              TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.creators IS
  'Creator profile. lat/lng used for map discovery.';

CREATE INDEX IF NOT EXISTS idx_creators_user_id ON public.creators(user_id);
CREATE INDEX IF NOT EXISTS idx_creators_lat_lng  ON public.creators(lat, lng);


-- =============================================================
-- 3. merchants
-- =============================================================
CREATE TABLE IF NOT EXISTS public.merchants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  business_name  TEXT NOT NULL,
  address        TEXT NOT NULL,
  lat            DOUBLE PRECISION,
  lng            DOUBLE PRECISION,
  contact_email  TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.merchants IS
  'Merchant profile. lat/lng places them on the creator map.';

CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON public.merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_lat_lng  ON public.merchants(lat, lng);


-- =============================================================
-- 4. campaigns
-- =============================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id     UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  payout          NUMERIC(10, 2) NOT NULL,
  spots_total     INT NOT NULL CHECK (spots_total > 0),
  spots_remaining INT NOT NULL CHECK (spots_remaining >= 0),
  deadline        DATE,
  status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'active', 'paused', 'closed')),
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT spots_remaining_lte_total CHECK (spots_remaining <= spots_total)
);

COMMENT ON TABLE public.campaigns IS
  'Campaign posted by a merchant. Only active rows appear on creator map.';

CREATE INDEX IF NOT EXISTS idx_campaigns_merchant_id ON public.campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status       ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_lat_lng      ON public.campaigns(lat, lng);


-- =============================================================
-- 5. campaign_applications
-- =============================================================
CREATE TABLE IF NOT EXISTS public.campaign_applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id  UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (creator_id, campaign_id)
);

COMMENT ON TABLE public.campaign_applications IS
  'Creator application to a campaign. Status: pending → accepted | rejected; creator can set → withdrawn.';

CREATE INDEX IF NOT EXISTS idx_applications_creator_id  ON public.campaign_applications(creator_id);
CREATE INDEX IF NOT EXISTS idx_applications_campaign_id ON public.campaign_applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_applications_status      ON public.campaign_applications(status);


-- =============================================================
-- 6. RLS
-- =============================================================
ALTER TABLE public.users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;


-- =============================================================
-- 7. Trigger — auto-create public.users on auth signup
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'creator')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
