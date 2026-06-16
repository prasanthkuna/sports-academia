


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."attendance_status" AS ENUM (
    'present',
    'absent',
    'late'
);


ALTER TYPE "public"."attendance_status" OWNER TO "postgres";


CREATE TYPE "public"."fee_status" AS ENUM (
    'pending',
    'partially_paid',
    'paid',
    'overdue',
    'cancelled'
);


ALTER TYPE "public"."fee_status" OWNER TO "postgres";


CREATE TYPE "public"."lead_status" AS ENUM (
    'new_enquiry',
    'contacted',
    'trial_booked',
    'trial_attended',
    'follow_up_pending',
    'converted',
    'lost'
);


ALTER TYPE "public"."lead_status" OWNER TO "postgres";


CREATE TYPE "public"."payment_mode" AS ENUM (
    'cash',
    'upi',
    'bank_transfer',
    'online',
    'cheque',
    'other'
);


ALTER TYPE "public"."payment_mode" OWNER TO "postgres";


CREATE TYPE "public"."payment_status" AS ENUM (
    'active',
    'cancelled'
);


ALTER TYPE "public"."payment_status" OWNER TO "postgres";


CREATE TYPE "public"."receipt_status" AS ENUM (
    'active',
    'cancelled'
);


ALTER TYPE "public"."receipt_status" OWNER TO "postgres";


CREATE TYPE "public"."student_status" AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE "public"."student_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'staff',
    'coach',
    'owner'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE TYPE "public"."wa_channel" AS ENUM (
    'click_to_send',
    'api'
);


ALTER TYPE "public"."wa_channel" OWNER TO "postgres";


CREATE TYPE "public"."wa_log_status" AS ENUM (
    'manual_sent',
    'sent',
    'failed'
);


ALTER TYPE "public"."wa_log_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auth_academy_id"() RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT academy_id FROM academy_users WHERE user_id = auth.uid() AND is_active = true LIMIT 1;
$$;


ALTER FUNCTION "public"."auth_academy_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auth_user_role"() RETURNS "public"."user_role"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT role FROM academy_users WHERE user_id = auth.uid() AND is_active = true LIMIT 1;
$$;


ALTER FUNCTION "public"."auth_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_financial_year"("d" "date" DEFAULT CURRENT_DATE) RETURNS integer
    LANGUAGE "sql" IMMUTABLE
    AS $$
  SELECT CASE WHEN EXTRACT(MONTH FROM d) >= 4 THEN EXTRACT(YEAR FROM d)::int ELSE EXTRACT(YEAR FROM d)::int - 1 END;
$$;


ALTER FUNCTION "public"."get_financial_year"("d" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_overdue_fees"() RETURNS "void"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  UPDATE student_fees SET status = 'overdue', updated_at = now()
  WHERE status IN ('pending', 'partially_paid') AND due_date < CURRENT_DATE;
$$;


ALTER FUNCTION "public"."mark_overdue_fees"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."next_receipt_number"("p_academy_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_prefix text;
  v_fy int;
  v_seq int;
BEGIN
  SELECT receipt_prefix INTO v_prefix FROM academy_settings WHERE academy_id = p_academy_id;
  v_fy := get_financial_year();
  INSERT INTO receipt_sequences (academy_id, financial_year, last_sequence)
  VALUES (p_academy_id, v_fy, 1)
  ON CONFLICT (academy_id, financial_year)
  DO UPDATE SET last_sequence = receipt_sequences.last_sequence + 1
  RETURNING last_sequence INTO v_seq;
  RETURN COALESCE(v_prefix, 'KCA') || '-' || v_fy::text || '-' || lpad(v_seq::text, 4, '0');
END;
$$;


ALTER FUNCTION "public"."next_receipt_number"("p_academy_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."next_student_code"("p_academy_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE v_count int;
BEGIN
  SELECT COUNT(*) + 1 INTO v_count FROM students WHERE academy_id = p_academy_id;
  RETURN 'STU-' || lpad(v_count::text, 4, '0');
END;
$$;


ALTER FUNCTION "public"."next_student_code"("p_academy_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."submit_enquiry"("p_slug" "text", "p_name" "text", "p_parent_name" "text", "p_mobile" "text", "p_whatsapp" "text" DEFAULT NULL::"text", "p_sport" "text" DEFAULT NULL::"text", "p_age" integer DEFAULT NULL::integer, "p_preferred_batch" "text" DEFAULT NULL::"text", "p_message" "text" DEFAULT NULL::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE v_academy_id uuid; v_lead_id uuid;
BEGIN
  SELECT id INTO v_academy_id FROM academies WHERE slug = p_slug AND is_active = true;
  IF v_academy_id IS NULL THEN RAISE EXCEPTION 'Academy not found'; END IF;
  INSERT INTO leads (academy_id, name, parent_name, mobile, whatsapp, sport_interested, age, preferred_batch_time, source, notes, status)
  VALUES (v_academy_id, p_name, p_parent_name, p_mobile, COALESCE(p_whatsapp, p_mobile), p_sport, p_age, p_preferred_batch, 'public_form', p_message, 'new_enquiry')
  RETURNING id INTO v_lead_id;
  RETURN v_lead_id;
END;
$$;


ALTER FUNCTION "public"."submit_enquiry"("p_slug" "text", "p_name" "text", "p_parent_name" "text", "p_mobile" "text", "p_whatsapp" "text", "p_sport" "text", "p_age" integer, "p_preferred_batch" "text", "p_message" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."academies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."academies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."academy_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "receipt_prefix" "text" DEFAULT 'KCA'::"text" NOT NULL,
    "default_currency" "text" DEFAULT 'INR'::"text" NOT NULL,
    "timezone" "text" DEFAULT 'Asia/Kolkata'::"text" NOT NULL,
    "address" "text",
    "contact_number" "text",
    "whatsapp_number" "text",
    "email" "text",
    "google_maps_link" "text",
    "google_review_link" "text",
    "gst_number" "text",
    "brand_color" "text" DEFAULT '#0F766E'::"text",
    "logo_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."academy_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."academy_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."user_role" DEFAULT 'staff'::"public"."user_role" NOT NULL,
    "display_name" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."academy_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attendance" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "batch_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "attendance_date" "date" NOT NULL,
    "status" "public"."attendance_status" DEFAULT 'present'::"public"."attendance_status" NOT NULL,
    "remarks" "text",
    "marked_by" "uuid",
    "marked_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "action" "text" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid",
    "old_value" "jsonb",
    "new_value" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."batch_students" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "batch_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "joined_at" "date" DEFAULT CURRENT_DATE,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."batch_students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."batches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "sport_id" "uuid",
    "coach_id" "uuid",
    "session_type" "text" DEFAULT 'morning'::"text",
    "start_time" time without time zone,
    "end_time" time without time zone,
    "capacity" integer DEFAULT 20,
    "days_of_week" integer[] DEFAULT '{1,2,3,4,5,6}'::integer[],
    "reference_fee" numeric,
    "description" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."batches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."coaches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "mobile" "text",
    "email" "text",
    "designation" "text",
    "joining_date" "date",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."coaches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fee_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."fee_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_followups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "note" "text" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."lead_followups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "parent_name" "text",
    "mobile" "text" NOT NULL,
    "whatsapp" "text",
    "sport_interested" "text",
    "age" integer,
    "preferred_batch_time" "text",
    "source" "text",
    "trial_date" "date",
    "status" "public"."lead_status" DEFAULT 'new_enquiry'::"public"."lead_status" NOT NULL,
    "assigned_staff_id" "uuid",
    "notes" "text",
    "converted_student_id" "uuid",
    "converted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "student_fee_id" "uuid" NOT NULL,
    "amount" numeric NOT NULL,
    "payment_mode" "public"."payment_mode" DEFAULT 'cash'::"public"."payment_mode" NOT NULL,
    "payment_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "collected_by" "uuid",
    "status" "public"."payment_status" DEFAULT 'active'::"public"."payment_status" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."receipt_sequences" (
    "academy_id" "uuid" NOT NULL,
    "financial_year" integer NOT NULL,
    "last_sequence" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."receipt_sequences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."receipts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "payment_id" "uuid" NOT NULL,
    "receipt_number" "text" NOT NULL,
    "pdf_url" "text",
    "status" "public"."receipt_status" DEFAULT 'active'::"public"."receipt_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."receipts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."staff" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "mobile" "text",
    "email" "text",
    "designation" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."staff" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_fees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "fee_type_id" "uuid" NOT NULL,
    "amount" numeric NOT NULL,
    "discount" numeric DEFAULT 0 NOT NULL,
    "late_fee" numeric DEFAULT 0 NOT NULL,
    "paid_amount" numeric DEFAULT 0 NOT NULL,
    "pending_amount" numeric NOT NULL,
    "due_date" "date" NOT NULL,
    "status" "public"."fee_status" DEFAULT 'pending'::"public"."fee_status" NOT NULL,
    "notes" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."student_fees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."students" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "student_code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "parent_name" "text" NOT NULL,
    "mobile" "text" NOT NULL,
    "whatsapp" "text",
    "dob" "date",
    "gender" "text",
    "address" "text",
    "sport_id" "uuid",
    "status" "public"."student_status" DEFAULT 'active'::"public"."student_status" NOT NULL,
    "joining_date" "date" DEFAULT CURRENT_DATE,
    "emergency_contact_name" "text",
    "emergency_contact_number" "text",
    "medical_notes" "text",
    "profile_photo_url" "text",
    "reference_source" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."whatsapp_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "student_id" "uuid",
    "recipient" "text" NOT NULL,
    "message_type" "text" NOT NULL,
    "body" "text" NOT NULL,
    "channel" "public"."wa_channel" DEFAULT 'click_to_send'::"public"."wa_channel" NOT NULL,
    "status" "public"."wa_log_status" DEFAULT 'manual_sent'::"public"."wa_log_status" NOT NULL,
    "failure_reason" "text",
    "triggered_by" "uuid",
    "sent_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."whatsapp_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."whatsapp_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "academy_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "message_type" "text" NOT NULL,
    "body" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."whatsapp_templates" OWNER TO "postgres";


ALTER TABLE ONLY "public"."academies"
    ADD CONSTRAINT "academies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."academies"
    ADD CONSTRAINT "academies_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."academy_settings"
    ADD CONSTRAINT "academy_settings_academy_id_key" UNIQUE ("academy_id");



ALTER TABLE ONLY "public"."academy_settings"
    ADD CONSTRAINT "academy_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."academy_users"
    ADD CONSTRAINT "academy_users_academy_id_user_id_key" UNIQUE ("academy_id", "user_id");



ALTER TABLE ONLY "public"."academy_users"
    ADD CONSTRAINT "academy_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_academy_id_batch_id_student_id_attendance_date_key" UNIQUE ("academy_id", "batch_id", "student_id", "attendance_date");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."batch_students"
    ADD CONSTRAINT "batch_students_batch_id_student_id_key" UNIQUE ("batch_id", "student_id");



ALTER TABLE ONLY "public"."batch_students"
    ADD CONSTRAINT "batch_students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."batches"
    ADD CONSTRAINT "batches_academy_id_name_key" UNIQUE ("academy_id", "name");



ALTER TABLE ONLY "public"."batches"
    ADD CONSTRAINT "batches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coaches"
    ADD CONSTRAINT "coaches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fee_types"
    ADD CONSTRAINT "fee_types_academy_id_name_key" UNIQUE ("academy_id", "name");



ALTER TABLE ONLY "public"."fee_types"
    ADD CONSTRAINT "fee_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lead_followups"
    ADD CONSTRAINT "lead_followups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."receipt_sequences"
    ADD CONSTRAINT "receipt_sequences_pkey" PRIMARY KEY ("academy_id", "financial_year");



ALTER TABLE ONLY "public"."receipts"
    ADD CONSTRAINT "receipts_academy_id_receipt_number_key" UNIQUE ("academy_id", "receipt_number");



ALTER TABLE ONLY "public"."receipts"
    ADD CONSTRAINT "receipts_payment_id_key" UNIQUE ("payment_id");



ALTER TABLE ONLY "public"."receipts"
    ADD CONSTRAINT "receipts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sports"
    ADD CONSTRAINT "sports_academy_id_name_key" UNIQUE ("academy_id", "name");



ALTER TABLE ONLY "public"."sports"
    ADD CONSTRAINT "sports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."staff"
    ADD CONSTRAINT "staff_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_fees"
    ADD CONSTRAINT "student_fees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_academy_id_student_code_key" UNIQUE ("academy_id", "student_code");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."whatsapp_logs"
    ADD CONSTRAINT "whatsapp_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."whatsapp_templates"
    ADD CONSTRAINT "whatsapp_templates_academy_id_message_type_key" UNIQUE ("academy_id", "message_type");



ALTER TABLE ONLY "public"."whatsapp_templates"
    ADD CONSTRAINT "whatsapp_templates_pkey" PRIMARY KEY ("id");



CREATE INDEX "student_fees_status_idx" ON "public"."student_fees" USING "btree" ("academy_id", "status", "due_date");



CREATE INDEX "student_fees_student_idx" ON "public"."student_fees" USING "btree" ("student_id", "status");



CREATE INDEX "students_academy_mobile_idx" ON "public"."students" USING "btree" ("academy_id", "mobile");



CREATE INDEX "students_academy_name_idx" ON "public"."students" USING "btree" ("academy_id", "name");



CREATE OR REPLACE TRIGGER "academies_updated" BEFORE UPDATE ON "public"."academies" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "academy_settings_updated" BEFORE UPDATE ON "public"."academy_settings" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "academy_users_updated" BEFORE UPDATE ON "public"."academy_users" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "batches_updated" BEFORE UPDATE ON "public"."batches" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "leads_updated" BEFORE UPDATE ON "public"."leads" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "student_fees_updated" BEFORE UPDATE ON "public"."student_fees" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "students_updated" BEFORE UPDATE ON "public"."students" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."academy_settings"
    ADD CONSTRAINT "academy_settings_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."academy_users"
    ADD CONSTRAINT "academy_users_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."academy_users"
    ADD CONSTRAINT "academy_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_marked_by_fkey" FOREIGN KEY ("marked_by") REFERENCES "public"."academy_users"("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."batch_students"
    ADD CONSTRAINT "batch_students_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."batch_students"
    ADD CONSTRAINT "batch_students_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."batch_students"
    ADD CONSTRAINT "batch_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."batches"
    ADD CONSTRAINT "batches_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."batches"
    ADD CONSTRAINT "batches_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id");



ALTER TABLE ONLY "public"."batches"
    ADD CONSTRAINT "batches_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id");



ALTER TABLE ONLY "public"."coaches"
    ADD CONSTRAINT "coaches_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."fee_types"
    ADD CONSTRAINT "fee_types_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lead_followups"
    ADD CONSTRAINT "lead_followups_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lead_followups"
    ADD CONSTRAINT "lead_followups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."lead_followups"
    ADD CONSTRAINT "lead_followups_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_assigned_staff_id_fkey" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."staff"("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_converted_student_id_fkey" FOREIGN KEY ("converted_student_id") REFERENCES "public"."students"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_collected_by_fkey" FOREIGN KEY ("collected_by") REFERENCES "public"."academy_users"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_student_fee_id_fkey" FOREIGN KEY ("student_fee_id") REFERENCES "public"."student_fees"("id");



ALTER TABLE ONLY "public"."receipt_sequences"
    ADD CONSTRAINT "receipt_sequences_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."receipts"
    ADD CONSTRAINT "receipts_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."receipts"
    ADD CONSTRAINT "receipts_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id");



ALTER TABLE ONLY "public"."sports"
    ADD CONSTRAINT "sports_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."staff"
    ADD CONSTRAINT "staff_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_fees"
    ADD CONSTRAINT "student_fees_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_fees"
    ADD CONSTRAINT "student_fees_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."student_fees"
    ADD CONSTRAINT "student_fees_fee_type_id_fkey" FOREIGN KEY ("fee_type_id") REFERENCES "public"."fee_types"("id");



ALTER TABLE ONLY "public"."student_fees"
    ADD CONSTRAINT "student_fees_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id");



ALTER TABLE ONLY "public"."whatsapp_logs"
    ADD CONSTRAINT "whatsapp_logs_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."whatsapp_logs"
    ADD CONSTRAINT "whatsapp_logs_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id");



ALTER TABLE ONLY "public"."whatsapp_logs"
    ADD CONSTRAINT "whatsapp_logs_triggered_by_fkey" FOREIGN KEY ("triggered_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."whatsapp_templates"
    ADD CONSTRAINT "whatsapp_templates_academy_id_fkey" FOREIGN KEY ("academy_id") REFERENCES "public"."academies"("id") ON DELETE CASCADE;



ALTER TABLE "public"."academies" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "academies_public_read" ON "public"."academies" FOR SELECT TO "anon" USING (("is_active" = true));



CREATE POLICY "academies_select" ON "public"."academies" FOR SELECT TO "authenticated" USING (("id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."academy_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "academy_settings_public_read" ON "public"."academy_settings" FOR SELECT TO "anon" USING (true);



CREATE POLICY "academy_settings_select" ON "public"."academy_settings" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "academy_settings_update" ON "public"."academy_settings" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."academy_users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "academy_users_select" ON "public"."academy_users" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."attendance" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "attendance_delete" ON "public"."attendance" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "attendance_insert" ON "public"."attendance" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "attendance_select" ON "public"."attendance" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "attendance_update" ON "public"."attendance" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "audit_logs_delete" ON "public"."audit_logs" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "audit_logs_insert" ON "public"."audit_logs" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "audit_logs_select" ON "public"."audit_logs" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "audit_logs_update" ON "public"."audit_logs" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."batch_students" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "batch_students_delete" ON "public"."batch_students" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "batch_students_insert" ON "public"."batch_students" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "batch_students_select" ON "public"."batch_students" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "batch_students_update" ON "public"."batch_students" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."batches" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "batches_delete" ON "public"."batches" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "batches_insert" ON "public"."batches" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "batches_select" ON "public"."batches" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "batches_update" ON "public"."batches" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."coaches" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "coaches_delete" ON "public"."coaches" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "coaches_insert" ON "public"."coaches" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "coaches_select" ON "public"."coaches" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "coaches_update" ON "public"."coaches" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."fee_types" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "fee_types_delete" ON "public"."fee_types" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "fee_types_insert" ON "public"."fee_types" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "fee_types_select" ON "public"."fee_types" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "fee_types_update" ON "public"."fee_types" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."lead_followups" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "lead_followups_delete" ON "public"."lead_followups" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "lead_followups_insert" ON "public"."lead_followups" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "lead_followups_select" ON "public"."lead_followups" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "lead_followups_update" ON "public"."lead_followups" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "leads_delete" ON "public"."leads" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "leads_insert" ON "public"."leads" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "leads_select" ON "public"."leads" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "leads_update" ON "public"."leads" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "payments_delete" ON "public"."payments" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "payments_insert" ON "public"."payments" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "payments_select" ON "public"."payments" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "payments_update" ON "public"."payments" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."receipt_sequences" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "receipt_sequences_all" ON "public"."receipt_sequences" TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"())) WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."receipts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "receipts_delete" ON "public"."receipts" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "receipts_insert" ON "public"."receipts" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "receipts_select" ON "public"."receipts" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "receipts_update" ON "public"."receipts" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."sports" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sports_delete" ON "public"."sports" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "sports_insert" ON "public"."sports" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "sports_public_read" ON "public"."sports" FOR SELECT TO "anon" USING (("is_active" = true));



CREATE POLICY "sports_select" ON "public"."sports" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "sports_update" ON "public"."sports" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."staff" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "staff_delete" ON "public"."staff" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "staff_insert" ON "public"."staff" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "staff_select" ON "public"."staff" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "staff_update" ON "public"."staff" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."student_fees" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "student_fees_delete" ON "public"."student_fees" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "student_fees_insert" ON "public"."student_fees" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "student_fees_select" ON "public"."student_fees" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "student_fees_update" ON "public"."student_fees" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "students_delete" ON "public"."students" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "students_insert" ON "public"."students" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "students_select" ON "public"."students" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "students_update" ON "public"."students" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."whatsapp_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "whatsapp_logs_delete" ON "public"."whatsapp_logs" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "whatsapp_logs_insert" ON "public"."whatsapp_logs" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "whatsapp_logs_select" ON "public"."whatsapp_logs" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "whatsapp_logs_update" ON "public"."whatsapp_logs" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



ALTER TABLE "public"."whatsapp_templates" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "whatsapp_templates_delete" ON "public"."whatsapp_templates" FOR DELETE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "whatsapp_templates_insert" ON "public"."whatsapp_templates" FOR INSERT TO "authenticated" WITH CHECK (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "whatsapp_templates_select" ON "public"."whatsapp_templates" FOR SELECT TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



CREATE POLICY "whatsapp_templates_update" ON "public"."whatsapp_templates" FOR UPDATE TO "authenticated" USING (("academy_id" = "public"."auth_academy_id"()));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."auth_academy_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."auth_academy_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auth_academy_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auth_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."auth_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auth_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_financial_year"("d" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."get_financial_year"("d" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_financial_year"("d" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_overdue_fees"() TO "anon";
GRANT ALL ON FUNCTION "public"."mark_overdue_fees"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_overdue_fees"() TO "service_role";



GRANT ALL ON FUNCTION "public"."next_receipt_number"("p_academy_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."next_receipt_number"("p_academy_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."next_receipt_number"("p_academy_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."next_student_code"("p_academy_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."next_student_code"("p_academy_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."next_student_code"("p_academy_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."submit_enquiry"("p_slug" "text", "p_name" "text", "p_parent_name" "text", "p_mobile" "text", "p_whatsapp" "text", "p_sport" "text", "p_age" integer, "p_preferred_batch" "text", "p_message" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."submit_enquiry"("p_slug" "text", "p_name" "text", "p_parent_name" "text", "p_mobile" "text", "p_whatsapp" "text", "p_sport" "text", "p_age" integer, "p_preferred_batch" "text", "p_message" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."submit_enquiry"("p_slug" "text", "p_name" "text", "p_parent_name" "text", "p_mobile" "text", "p_whatsapp" "text", "p_sport" "text", "p_age" integer, "p_preferred_batch" "text", "p_message" "text") TO "service_role";



GRANT ALL ON TABLE "public"."academies" TO "anon";
GRANT ALL ON TABLE "public"."academies" TO "authenticated";
GRANT ALL ON TABLE "public"."academies" TO "service_role";



GRANT ALL ON TABLE "public"."academy_settings" TO "anon";
GRANT ALL ON TABLE "public"."academy_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."academy_settings" TO "service_role";



GRANT ALL ON TABLE "public"."academy_users" TO "anon";
GRANT ALL ON TABLE "public"."academy_users" TO "authenticated";
GRANT ALL ON TABLE "public"."academy_users" TO "service_role";



GRANT ALL ON TABLE "public"."attendance" TO "anon";
GRANT ALL ON TABLE "public"."attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."attendance" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."batch_students" TO "anon";
GRANT ALL ON TABLE "public"."batch_students" TO "authenticated";
GRANT ALL ON TABLE "public"."batch_students" TO "service_role";



GRANT ALL ON TABLE "public"."batches" TO "anon";
GRANT ALL ON TABLE "public"."batches" TO "authenticated";
GRANT ALL ON TABLE "public"."batches" TO "service_role";



GRANT ALL ON TABLE "public"."coaches" TO "anon";
GRANT ALL ON TABLE "public"."coaches" TO "authenticated";
GRANT ALL ON TABLE "public"."coaches" TO "service_role";



GRANT ALL ON TABLE "public"."fee_types" TO "anon";
GRANT ALL ON TABLE "public"."fee_types" TO "authenticated";
GRANT ALL ON TABLE "public"."fee_types" TO "service_role";



GRANT ALL ON TABLE "public"."lead_followups" TO "anon";
GRANT ALL ON TABLE "public"."lead_followups" TO "authenticated";
GRANT ALL ON TABLE "public"."lead_followups" TO "service_role";



GRANT ALL ON TABLE "public"."leads" TO "anon";
GRANT ALL ON TABLE "public"."leads" TO "authenticated";
GRANT ALL ON TABLE "public"."leads" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."receipt_sequences" TO "anon";
GRANT ALL ON TABLE "public"."receipt_sequences" TO "authenticated";
GRANT ALL ON TABLE "public"."receipt_sequences" TO "service_role";



GRANT ALL ON TABLE "public"."receipts" TO "anon";
GRANT ALL ON TABLE "public"."receipts" TO "authenticated";
GRANT ALL ON TABLE "public"."receipts" TO "service_role";



GRANT ALL ON TABLE "public"."sports" TO "anon";
GRANT ALL ON TABLE "public"."sports" TO "authenticated";
GRANT ALL ON TABLE "public"."sports" TO "service_role";



GRANT ALL ON TABLE "public"."staff" TO "anon";
GRANT ALL ON TABLE "public"."staff" TO "authenticated";
GRANT ALL ON TABLE "public"."staff" TO "service_role";



GRANT ALL ON TABLE "public"."student_fees" TO "anon";
GRANT ALL ON TABLE "public"."student_fees" TO "authenticated";
GRANT ALL ON TABLE "public"."student_fees" TO "service_role";



GRANT ALL ON TABLE "public"."students" TO "anon";
GRANT ALL ON TABLE "public"."students" TO "authenticated";
GRANT ALL ON TABLE "public"."students" TO "service_role";



GRANT ALL ON TABLE "public"."whatsapp_logs" TO "anon";
GRANT ALL ON TABLE "public"."whatsapp_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."whatsapp_logs" TO "service_role";



GRANT ALL ON TABLE "public"."whatsapp_templates" TO "anon";
GRANT ALL ON TABLE "public"."whatsapp_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."whatsapp_templates" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







