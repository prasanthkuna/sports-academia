-- Self-serve signup: 7-day Pro trial, academy provisioning, trial expiry

CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'expired');

ALTER TABLE public.academies
  ADD COLUMN IF NOT EXISTS subscription_status public.subscription_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

-- Existing academies (demo, pilots) remain fully active
UPDATE public.academies
SET subscription_status = 'active'
WHERE subscription_status IS DISTINCT FROM 'active'
  AND trial_ends_at IS NULL
  AND onboarding_completed_at IS NULL;

CREATE OR REPLACE FUNCTION public.expire_overdue_trials()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.academies
  SET subscription_status = 'expired'
  WHERE subscription_status = 'trial'
    AND trial_ends_at IS NOT NULL
    AND trial_ends_at < now();
END;
$$;

CREATE OR REPLACE FUNCTION public.provision_academy(
  p_user_id uuid,
  p_owner_name text,
  p_academy_name text,
  p_slug text,
  p_sport_name text DEFAULT 'Cricket'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_academy_id uuid;
  v_slug text;
  v_prefix text;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.academy_users
    WHERE user_id = p_user_id AND is_active = true
  ) THEN
    RAISE EXCEPTION 'User already belongs to an academy';
  END IF;

  v_slug := lower(trim(p_slug));
  IF length(v_slug) < 3 OR v_slug !~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]{3}$' THEN
    RAISE EXCEPTION 'Slug must be 3+ lowercase letters, numbers, or hyphens';
  END IF;

  IF EXISTS (SELECT 1 FROM public.academies WHERE slug = v_slug) THEN
    RAISE EXCEPTION 'This academy URL is already taken';
  END IF;

  IF length(trim(p_academy_name)) < 2 THEN
    RAISE EXCEPTION 'Academy name is required';
  END IF;

  INSERT INTO public.academies (name, slug, plan, subscription_status, trial_ends_at)
  VALUES (
    trim(p_academy_name),
    v_slug,
    'pro',
    'trial',
    now() + interval '7 days'
  )
  RETURNING id INTO v_academy_id;

  v_prefix := upper(left(regexp_replace(v_slug, '[^a-z0-9]', '', 'g'), 3));
  IF length(v_prefix) < 2 THEN
    v_prefix := 'ACA';
  END IF;

  INSERT INTO public.academy_settings (academy_id, receipt_prefix)
  VALUES (v_academy_id, v_prefix);

  INSERT INTO public.academy_users (academy_id, user_id, role, display_name, is_active)
  VALUES (
    v_academy_id,
    p_user_id,
    'owner',
    nullif(trim(p_owner_name), ''),
    true
  );

  INSERT INTO public.fee_types (academy_id, name)
  VALUES
    (v_academy_id, 'Monthly fee'),
    (v_academy_id, 'Admission fee'),
    (v_academy_id, 'Summer camp');

  INSERT INTO public.sports (academy_id, name)
  VALUES (v_academy_id, coalesce(nullif(trim(p_sport_name), ''), 'Cricket'));

  RETURN v_academy_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_academy_onboarding(p_academy_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_academy_id IS DISTINCT FROM public.auth_academy_id() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  UPDATE public.academies
  SET onboarding_completed_at = now()
  WHERE id = p_academy_id
    AND onboarding_completed_at IS NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.expire_overdue_trials() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.provision_academy(uuid, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_academy_onboarding(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.check_slug_available(p_slug text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.academies WHERE slug = lower(trim(p_slug))
  );
$$;

GRANT EXECUTE ON FUNCTION public.check_slug_available(text) TO anon, authenticated;
