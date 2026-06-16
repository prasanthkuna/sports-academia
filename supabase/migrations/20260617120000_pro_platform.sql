-- Pro platform: plans, QR, geofence, audit, automation tables

CREATE TYPE public.academy_plan AS ENUM ('starter', 'pro');
CREATE TYPE public.attendance_source AS ENUM ('manual', 'qr_scan', 'coach');
CREATE TYPE public.reminder_type AS ENUM ('fee_overdue', 'fee_due', 'birthday', 'session', 'digest');

ALTER TABLE public.academies
  ADD COLUMN IF NOT EXISTS plan public.academy_plan NOT NULL DEFAULT 'pro';

ALTER TABLE public.academy_users
  ADD COLUMN IF NOT EXISTS coach_id uuid REFERENCES public.coaches(id) ON DELETE SET NULL;

ALTER TABLE public.attendance
  ADD COLUMN IF NOT EXISTS source public.attendance_source NOT NULL DEFAULT 'manual';

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS qr_token text,
  ADD COLUMN IF NOT EXISTS qr_token_created_at timestamptz;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS check_in_token text;

ALTER TABLE public.receipts
  ADD COLUMN IF NOT EXISTS verify_token text;

ALTER TABLE public.academy_settings
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS geofence_radius_m integer NOT NULL DEFAULT 200,
  ADD COLUMN IF NOT EXISTS qr_checkin_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS checkin_pin_required boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS checkin_window_before_min integer NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS checkin_window_after_min integer NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS digest_time time NOT NULL DEFAULT '20:00:00',
  ADD COLUMN IF NOT EXISTS reminders_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS geofence_required boolean NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS students_qr_token_idx ON public.students (qr_token) WHERE qr_token IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS leads_check_in_token_idx ON public.leads (check_in_token) WHERE check_in_token IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS receipts_verify_token_idx ON public.receipts (verify_token) WHERE verify_token IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.qr_scan_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  scan_type text NOT NULL,
  success boolean NOT NULL,
  failure_reason text,
  latitude double precision,
  longitude double precision,
  distance_m double precision,
  device_hint text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.owner_digest_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  digest_date date NOT NULL,
  payload jsonb NOT NULL,
  whatsapp_body text NOT NULL,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (academy_id, digest_date)
);

CREATE TABLE IF NOT EXISTS public.job_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid REFERENCES public.academies(id) ON DELETE CASCADE,
  job_name text NOT NULL,
  run_at timestamptz NOT NULL DEFAULT now(),
  success_count integer NOT NULL DEFAULT 0,
  fail_count integer NOT NULL DEFAULT 0,
  errors jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reminder_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  reminder_type public.reminder_type NOT NULL,
  recipient_mobile text NOT NULL,
  recipient_name text,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  whatsapp_body text NOT NULL,
  due_date date NOT NULL DEFAULT CURRENT_DATE,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.import_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  file_name text,
  entity_types text[] NOT NULL,
  success_count integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  errors jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.qr_scan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_digest_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY qr_scan_logs_select ON public.qr_scan_logs FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id());
CREATE POLICY qr_scan_logs_insert ON public.qr_scan_logs FOR INSERT TO authenticated
  WITH CHECK (academy_id = public.auth_academy_id());

CREATE POLICY owner_digest_snapshots_select ON public.owner_digest_snapshots FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id());

CREATE POLICY job_logs_select ON public.job_logs FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id() OR academy_id IS NULL);

CREATE POLICY reminder_queue_select ON public.reminder_queue FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id());
CREATE POLICY reminder_queue_update ON public.reminder_queue FOR UPDATE TO authenticated
  USING (academy_id = public.auth_academy_id());

CREATE POLICY import_logs_select ON public.import_logs FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id());
CREATE POLICY import_logs_insert ON public.import_logs FOR INSERT TO authenticated
  WITH CHECK (academy_id = public.auth_academy_id());

CREATE OR REPLACE FUNCTION public.auth_coach_id() RETURNS uuid
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO public AS $$
  SELECT coach_id FROM academy_users WHERE user_id = auth.uid() AND is_active = true LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.starter_limit_exceeded(
  p_academy_id uuid, p_entity text
) RETURNS boolean
  LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO public AS $$
DECLARE v_plan public.academy_plan;
DECLARE v_count integer;
BEGIN
  SELECT plan INTO v_plan FROM academies WHERE id = p_academy_id;
  IF v_plan IS DISTINCT FROM 'starter' THEN RETURN false; END IF;

  IF p_entity = 'students' THEN
    SELECT COUNT(*) INTO v_count FROM students WHERE academy_id = p_academy_id AND status = 'active';
    RETURN v_count >= 150;
  ELSIF p_entity = 'users' THEN
    SELECT COUNT(*) INTO v_count FROM academy_users WHERE academy_id = p_academy_id AND is_active = true;
    RETURN v_count >= 3;
  ELSIF p_entity = 'batches' THEN
    SELECT COUNT(*) INTO v_count FROM batches WHERE academy_id = p_academy_id AND is_active = true;
    RETURN v_count >= 6;
  ELSIF p_entity = 'sports' THEN
    SELECT COUNT(*) INTO v_count FROM sports WHERE academy_id = p_academy_id AND is_active = true;
    RETURN v_count >= 1;
  END IF;
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_student_qr_token() RETURNS trigger
  LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.qr_token IS NULL THEN
    NEW.qr_token := encode(gen_random_bytes(24), 'hex');
    NEW.qr_token_created_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS students_qr_token ON public.students;
CREATE TRIGGER students_qr_token
  BEFORE INSERT ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.ensure_student_qr_token();

CREATE OR REPLACE FUNCTION public.haversine_m(
  lat1 double precision, lon1 double precision,
  lat2 double precision, lon2 double precision
) RETURNS double precision
  LANGUAGE sql IMMUTABLE AS $$
  SELECT 6371000 * 2 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2) +
    cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lon2 - lon1) / 2), 2)
  ));
$$;

CREATE OR REPLACE FUNCTION public.student_qr_check_in(
  p_slug text,
  p_qr_token text,
  p_batch_id uuid,
  p_pin text DEFAULT NULL,
  p_latitude double precision DEFAULT NULL,
  p_longitude double precision DEFAULT NULL,
  p_device_hint text DEFAULT NULL
) RETURNS jsonb
  LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE
  v_academy record;
  v_settings record;
  v_student record;
  v_batch record;
  v_distance double precision;
  v_today date := CURRENT_DATE;
  v_dow integer;
  v_now time := LOCALTIME;
  v_window_start time;
  v_window_end time;
  v_pin_expected text;
BEGIN
  SELECT a.id, a.plan, a.name INTO v_academy
  FROM academies a WHERE a.slug = p_slug AND a.is_active = true;
  IF v_academy.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Academy not found');
  END IF;
  IF v_academy.plan IS DISTINCT FROM 'pro' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'QR check-in requires Pro plan');
  END IF;

  SELECT * INTO v_settings FROM academy_settings WHERE academy_id = v_academy.id;
  IF NOT COALESCE(v_settings.qr_checkin_enabled, true) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'QR check-in is disabled');
  END IF;

  SELECT * INTO v_student FROM students
  WHERE academy_id = v_academy.id AND qr_token = p_qr_token AND status = 'active';
  IF v_student.id IS NULL THEN
    INSERT INTO qr_scan_logs (academy_id, scan_type, success, failure_reason, device_hint)
    VALUES (v_academy.id, 'student_check_in', false, 'Invalid token', p_device_hint);
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid student QR');
  END IF;

  SELECT * INTO v_batch FROM batches
  WHERE id = p_batch_id AND academy_id = v_academy.id AND is_active = true;
  IF v_batch.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid batch');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM batch_students
    WHERE batch_id = p_batch_id AND student_id = v_student.id AND is_active = true
  ) THEN
    INSERT INTO qr_scan_logs (academy_id, student_id, batch_id, scan_type, success, failure_reason, device_hint)
    VALUES (v_academy.id, v_student.id, p_batch_id, 'student_check_in', false, 'Not in batch', p_device_hint);
    RETURN jsonb_build_object('ok', false, 'error', 'Student not assigned to this batch');
  END IF;

  v_dow := EXTRACT(ISODOW FROM v_today)::integer;
  IF v_batch.days_of_week IS NOT NULL AND NOT (v_dow = ANY (v_batch.days_of_week)) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'No session scheduled today for this batch');
  END IF;

  IF v_batch.start_time IS NOT NULL AND v_batch.end_time IS NOT NULL THEN
    v_window_start := v_batch.start_time - (COALESCE(v_settings.checkin_window_before_min, 30) || ' minutes')::interval;
    v_window_end := v_batch.end_time + (COALESCE(v_settings.checkin_window_after_min, 15) || ' minutes')::interval;
    IF v_now < v_window_start OR v_now > v_window_end THEN
      RETURN jsonb_build_object('ok', false, 'error', 'Outside check-in window');
    END IF;
  END IF;

  IF COALESCE(v_settings.checkin_pin_required, true) THEN
    v_pin_expected := right(regexp_replace(v_student.mobile, '\D', '', 'g'), 4);
    IF p_pin IS NULL OR p_pin <> v_pin_expected THEN
      INSERT INTO qr_scan_logs (academy_id, student_id, batch_id, scan_type, success, failure_reason, device_hint)
      VALUES (v_academy.id, v_student.id, p_batch_id, 'student_check_in', false, 'Invalid PIN', p_device_hint);
      RETURN jsonb_build_object('ok', false, 'error', 'Invalid PIN (last 4 digits of mobile)');
    END IF;
  END IF;

  IF COALESCE(v_settings.geofence_required, true) THEN
    IF v_settings.latitude IS NULL OR v_settings.longitude IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'error', 'Academy location not configured');
    END IF;
    IF p_latitude IS NULL OR p_longitude IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'error', 'Location permission required');
    END IF;
    v_distance := haversine_m(v_settings.latitude, v_settings.longitude, p_latitude, p_longitude);
    IF v_distance > COALESCE(v_settings.geofence_radius_m, 200) THEN
      INSERT INTO qr_scan_logs (academy_id, student_id, batch_id, scan_type, success, failure_reason,
        latitude, longitude, distance_m, device_hint)
      VALUES (v_academy.id, v_student.id, p_batch_id, 'student_check_in', false, 'Outside geofence',
        p_latitude, p_longitude, v_distance, p_device_hint);
      RETURN jsonb_build_object('ok', false, 'error', 'You must be at the academy to check in', 'distance_m', v_distance);
    END IF;
  END IF;

  INSERT INTO attendance (academy_id, batch_id, student_id, attendance_date, status, source, marked_at)
  VALUES (v_academy.id, p_batch_id, v_student.id, v_today, 'present', 'qr_scan', now())
  ON CONFLICT (academy_id, batch_id, student_id, attendance_date)
  DO UPDATE SET status = 'present', source = 'qr_scan', marked_at = now();

  INSERT INTO qr_scan_logs (academy_id, student_id, batch_id, scan_type, success,
    latitude, longitude, distance_m, device_hint)
  VALUES (v_academy.id, v_student.id, p_batch_id, 'student_check_in', true,
    p_latitude, p_longitude, v_distance, p_device_hint);

  RETURN jsonb_build_object(
    'ok', true,
    'student_name', v_student.name,
    'batch_name', v_batch.name,
    'academy_name', v_academy.name,
    'checked_in_at', now()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.trial_lead_check_in(
  p_slug text,
  p_token text,
  p_latitude double precision DEFAULT NULL,
  p_longitude double precision DEFAULT NULL
) RETURNS jsonb
  LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE
  v_academy record;
  v_settings record;
  v_lead record;
  v_distance double precision;
BEGIN
  SELECT a.id, a.name INTO v_academy FROM academies a WHERE a.slug = p_slug AND a.is_active = true;
  IF v_academy.id IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'Academy not found'); END IF;

  SELECT * INTO v_settings FROM academy_settings WHERE academy_id = v_academy.id;

  SELECT * INTO v_lead FROM leads
  WHERE academy_id = v_academy.id AND check_in_token = p_token
    AND status NOT IN ('converted', 'lost');
  IF v_lead.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Invalid trial link');
  END IF;

  IF COALESCE(v_settings.geofence_required, true) THEN
    IF v_settings.latitude IS NULL OR v_settings.longitude IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'error', 'Academy location not configured');
    END IF;
    IF p_latitude IS NULL OR p_longitude IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'error', 'Location permission required');
    END IF;
    v_distance := haversine_m(v_settings.latitude, v_settings.longitude, p_latitude, p_longitude);
    IF v_distance > COALESCE(v_settings.geofence_radius_m, 200) THEN
      RETURN jsonb_build_object('ok', false, 'error', 'You must be at the academy', 'distance_m', v_distance);
    END IF;
  END IF;

  UPDATE leads SET status = 'trial_attended', trial_date = CURRENT_DATE, updated_at = now()
  WHERE id = v_lead.id;

  INSERT INTO qr_scan_logs (academy_id, lead_id, scan_type, success, latitude, longitude, distance_m)
  VALUES (v_academy.id, v_lead.id, 'trial_check_in', true, p_latitude, p_longitude, v_distance);

  RETURN jsonb_build_object('ok', true, 'lead_name', v_lead.name, 'academy_name', v_academy.name);
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_receipt_public(p_token text)
  RETURNS jsonb
  LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE v_rec record;
BEGIN
  SELECT r.receipt_number, r.created_at, p.amount, p.payment_mode, p.payment_date,
         s.name AS student_name, a.name AS academy_name
  INTO v_rec
  FROM receipts r
  JOIN payments p ON p.id = r.payment_id
  JOIN student_fees sf ON sf.id = p.student_fee_id
  JOIN students s ON s.id = sf.student_id
  JOIN academies a ON a.id = r.academy_id
  WHERE r.verify_token = p_token AND r.status = 'active';

  IF v_rec IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Receipt not found');
  END IF;

  RETURN jsonb_build_object('ok', true, 'receipt', row_to_json(v_rec));
END;
$$;

GRANT EXECUTE ON FUNCTION public.student_qr_check_in TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.trial_lead_check_in TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_receipt_public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.haversine_m TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.auth_coach_id TO authenticated;
