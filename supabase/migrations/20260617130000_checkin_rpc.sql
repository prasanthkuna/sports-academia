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

GRANT EXECUTE ON FUNCTION public.student_qr_check_in TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.trial_lead_check_in TO anon, authenticated;
