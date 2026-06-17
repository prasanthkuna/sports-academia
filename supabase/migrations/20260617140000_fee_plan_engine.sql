-- Fee Plan Engine: plans, assignments, demands (student_fees), sessions, renewal events

CREATE TYPE public.fee_plan_type AS ENUM (
  'monthly',
  'quarterly',
  'admission',
  'session_package',
  'personal_coaching',
  'summer_camp'
);

CREATE TYPE public.assignment_status AS ENUM (
  'active',
  'expired',
  'cancelled',
  'completed',
  'paused'
);

CREATE TYPE public.renewal_event_type AS ENUM (
  'demand_generated',
  'renewal_paid',
  'assignment_expired',
  'session_consumed',
  'reminder_sent'
);

CREATE TABLE public.fee_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name text NOT NULL,
  plan_type public.fee_plan_type NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  billing_cycle_months int,
  total_sessions int,
  validity_days int,
  due_day int CHECK (due_day IS NULL OR (due_day >= 1 AND due_day <= 28)),
  sport_id uuid REFERENCES public.sports(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  fee_type_id uuid REFERENCES public.fee_types(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.student_fee_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  fee_plan_id uuid NOT NULL REFERENCES public.fee_plans(id) ON DELETE RESTRICT,
  start_date date NOT NULL,
  end_date date,
  status public.assignment_status NOT NULL DEFAULT 'active',
  sessions_total int,
  sessions_used int NOT NULL DEFAULT 0,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.package_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  assignment_id uuid NOT NULL REFERENCES public.student_fee_assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  attendance_id uuid REFERENCES public.attendance(id) ON DELETE SET NULL,
  session_date date NOT NULL,
  consumed_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE TABLE public.renewal_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id uuid NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES public.student_fee_assignments(id) ON DELETE SET NULL,
  student_fee_id uuid REFERENCES public.student_fees(id) ON DELETE SET NULL,
  event_type public.renewal_event_type NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_fees
  ALTER COLUMN fee_type_id DROP NOT NULL,
  ADD COLUMN fee_plan_id uuid REFERENCES public.fee_plans(id) ON DELETE SET NULL,
  ADD COLUMN assignment_id uuid REFERENCES public.student_fee_assignments(id) ON DELETE SET NULL,
  ADD COLUMN period_label text;

CREATE INDEX fee_plans_academy_idx ON public.fee_plans(academy_id, is_active);
CREATE INDEX assignments_student_idx ON public.student_fee_assignments(student_id, status);
CREATE INDEX assignments_academy_status_idx ON public.student_fee_assignments(academy_id, status, end_date);
CREATE INDEX student_fees_assignment_idx ON public.student_fees(assignment_id, status);
CREATE INDEX student_fees_plan_idx ON public.student_fees(fee_plan_id, due_date);
CREATE INDEX package_sessions_assignment_idx ON public.package_sessions(assignment_id, session_date);
CREATE INDEX renewal_events_student_idx ON public.renewal_events(student_id, created_at DESC);

CREATE TRIGGER fee_plans_updated BEFORE UPDATE ON public.fee_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER student_fee_assignments_updated BEFORE UPDATE ON public.student_fee_assignments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Sync assignment expiry and session exhaustion
CREATE OR REPLACE FUNCTION public.sync_assignment_status(p_academy_id uuid DEFAULT NULL)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int := 0;
BEGIN
  UPDATE public.student_fee_assignments sfa
  SET status = 'expired', updated_at = now()
  WHERE (p_academy_id IS NULL OR sfa.academy_id = p_academy_id)
    AND sfa.status = 'active'
    AND sfa.end_date IS NOT NULL
    AND sfa.end_date < CURRENT_DATE;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  UPDATE public.student_fee_assignments sfa
  SET status = 'completed', updated_at = now()
  WHERE (p_academy_id IS NULL OR sfa.academy_id = p_academy_id)
    AND sfa.status = 'active'
    AND sfa.sessions_total IS NOT NULL
    AND sfa.sessions_used >= sfa.sessions_total;

  RETURN v_count;
END;
$$;

-- Generate recurring fee demands for monthly/quarterly active assignments
CREATE OR REPLACE FUNCTION public.generate_recurring_demands(p_academy_id uuid DEFAULT NULL)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
  v_period_label text;
  v_due_date date;
  v_months int;
  v_exists boolean;
  v_created int := 0;
BEGIN
  PERFORM public.sync_assignment_status(p_academy_id);
  PERFORM public.mark_overdue_fees();

  FOR r IN
    SELECT sfa.*, fp.plan_type, fp.amount, fp.billing_cycle_months, fp.due_day, fp.fee_type_id, fp.name AS plan_name
    FROM public.student_fee_assignments sfa
    JOIN public.fee_plans fp ON fp.id = sfa.fee_plan_id
    WHERE sfa.status = 'active'
      AND fp.plan_type IN ('monthly', 'quarterly')
      AND fp.is_active = true
      AND (p_academy_id IS NULL OR sfa.academy_id = p_academy_id)
  LOOP
    v_months := COALESCE(r.billing_cycle_months, CASE WHEN r.plan_type = 'quarterly' THEN 3 ELSE 1 END);

    IF v_months = 3 THEN
      v_period_label := 'Q' || to_char(CURRENT_DATE, 'Q YYYY');
      v_due_date := date_trunc('quarter', CURRENT_DATE)::date
        + (COALESCE(r.due_day, 1) - 1) * interval '1 day';
    ELSE
      v_period_label := to_char(CURRENT_DATE, 'Mon YYYY');
      v_due_date := date_trunc('month', CURRENT_DATE)::date
        + (COALESCE(r.due_day, 5) - 1) * interval '1 day';
    END IF;

    IF v_due_date < CURRENT_DATE THEN
      v_due_date := CURRENT_DATE + interval '3 days';
    END IF;

    SELECT EXISTS (
      SELECT 1 FROM public.student_fees sf
      WHERE sf.assignment_id = r.id
        AND sf.period_label = v_period_label
        AND sf.status != 'cancelled'
    ) INTO v_exists;

    IF NOT v_exists THEN
      INSERT INTO public.student_fees (
        academy_id, student_id, fee_type_id, fee_plan_id, assignment_id,
        amount, pending_amount, due_date, period_label, status
      ) VALUES (
        r.academy_id, r.student_id, r.fee_type_id, r.fee_plan_id, r.id,
        r.amount, r.amount, v_due_date, v_period_label, 'pending'
      );

      INSERT INTO public.renewal_events (
        academy_id, student_id, assignment_id, event_type, notes
      ) VALUES (
        r.academy_id, r.student_id, r.id, 'demand_generated',
        v_period_label || ' demand for ' || r.plan_name
      );

      v_created := v_created + 1;
    END IF;
  END LOOP;

  RETURN v_created;
END;
$$;

-- Consume one package session when student attends
CREATE OR REPLACE FUNCTION public.consume_package_session(
  p_assignment_id uuid,
  p_student_id uuid,
  p_attendance_id uuid,
  p_session_date date,
  p_created_by uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_assignment public.student_fee_assignments%ROWTYPE;
  v_session_id uuid;
BEGIN
  SELECT * INTO v_assignment
  FROM public.student_fee_assignments
  WHERE id = p_assignment_id AND student_id = p_student_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Assignment not found');
  END IF;

  IF v_assignment.status != 'active' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Package not active');
  END IF;

  IF v_assignment.sessions_total IS NOT NULL AND v_assignment.sessions_used >= v_assignment.sessions_total THEN
    RETURN jsonb_build_object('ok', false, 'error', 'No sessions remaining');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.package_sessions
    WHERE assignment_id = p_assignment_id AND session_date = p_session_date
  ) THEN
    RETURN jsonb_build_object('ok', true, 'duplicate', true);
  END IF;

  INSERT INTO public.package_sessions (
    academy_id, assignment_id, student_id, attendance_id, session_date, created_by
  ) VALUES (
    v_assignment.academy_id, p_assignment_id, p_student_id, p_attendance_id, p_session_date, p_created_by
  ) RETURNING id INTO v_session_id;

  UPDATE public.student_fee_assignments
  SET sessions_used = sessions_used + 1, updated_at = now()
  WHERE id = p_assignment_id;

  INSERT INTO public.renewal_events (
    academy_id, student_id, assignment_id, event_type, notes
  ) VALUES (
    v_assignment.academy_id, p_student_id, p_assignment_id, 'session_consumed',
    'Session ' || (v_assignment.sessions_used + 1) || ' of ' || COALESCE(v_assignment.sessions_total::text, '?')
  );

  PERFORM public.sync_assignment_status(v_assignment.academy_id);

  RETURN jsonb_build_object(
    'ok', true,
    'session_id', v_session_id,
    'remaining', GREATEST(0, COALESCE(v_assignment.sessions_total, 0) - v_assignment.sessions_used - 1)
  );
END;
$$;

-- RLS
ALTER TABLE public.fee_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fee_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renewal_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY fee_plans_select ON public.fee_plans FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id());
CREATE POLICY fee_plans_insert ON public.fee_plans FOR INSERT TO authenticated
  WITH CHECK (academy_id = public.auth_academy_id());
CREATE POLICY fee_plans_update ON public.fee_plans FOR UPDATE TO authenticated
  USING (academy_id = public.auth_academy_id());
CREATE POLICY fee_plans_delete ON public.fee_plans FOR DELETE TO authenticated
  USING (academy_id = public.auth_academy_id());

CREATE POLICY assignments_select ON public.student_fee_assignments FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id());
CREATE POLICY assignments_insert ON public.student_fee_assignments FOR INSERT TO authenticated
  WITH CHECK (academy_id = public.auth_academy_id());
CREATE POLICY assignments_update ON public.student_fee_assignments FOR UPDATE TO authenticated
  USING (academy_id = public.auth_academy_id());
CREATE POLICY assignments_delete ON public.student_fee_assignments FOR DELETE TO authenticated
  USING (academy_id = public.auth_academy_id());

CREATE POLICY package_sessions_select ON public.package_sessions FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id());
CREATE POLICY package_sessions_insert ON public.package_sessions FOR INSERT TO authenticated
  WITH CHECK (academy_id = public.auth_academy_id());

CREATE POLICY renewal_events_select ON public.renewal_events FOR SELECT TO authenticated
  USING (academy_id = public.auth_academy_id());
CREATE POLICY renewal_events_insert ON public.renewal_events FOR INSERT TO authenticated
  WITH CHECK (academy_id = public.auth_academy_id());

GRANT ALL ON TABLE public.fee_plans TO authenticated, service_role;
GRANT ALL ON TABLE public.student_fee_assignments TO authenticated, service_role;
GRANT ALL ON TABLE public.package_sessions TO authenticated, service_role;
GRANT ALL ON TABLE public.renewal_events TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.sync_assignment_status(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.generate_recurring_demands(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.consume_package_session(uuid, uuid, uuid, date, uuid) TO authenticated, service_role;
