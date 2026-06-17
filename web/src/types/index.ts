export type { AcademyPlan } from "@/lib/plans";

export type UserRole = "admin" | "staff" | "coach" | "owner";
export type FeeStatus = "pending" | "partially_paid" | "paid" | "overdue" | "cancelled";
export type FeePlanType =
  | "monthly"
  | "quarterly"
  | "admission"
  | "session_package"
  | "personal_coaching"
  | "summer_camp";
export type AssignmentStatus = "active" | "expired" | "cancelled" | "completed" | "paused";
export type RenewalEventType =
  | "demand_generated"
  | "renewal_paid"
  | "assignment_expired"
  | "session_consumed"
  | "reminder_sent";
export type AttendanceStatus = "present" | "absent" | "late";
export type AttendanceSource = "manual" | "qr_scan" | "coach";
export type LeadStatus =
  | "new_enquiry"
  | "contacted"
  | "trial_booked"
  | "trial_attended"
  | "follow_up_pending"
  | "converted"
  | "lost";

export type AcademySettings = {
  receipt_prefix: string;
  address: string | null;
  contact_number: string | null;
  whatsapp_number: string | null;
  email: string | null;
  google_review_link: string | null;
  brand_color: string | null;
  logo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  geofence_radius_m: number;
  geofence_required: boolean;
  qr_checkin_enabled: boolean;
  checkin_pin_required: boolean;
  checkin_window_before_min: number;
  checkin_window_after_min: number;
  digest_time: string;
  reminders_enabled: boolean;
};

export type AcademyUser = {
  id: string;
  academy_id: string;
  user_id: string;
  role: UserRole;
  display_name: string | null;
  coach_id: string | null;
  is_active: boolean;
};

export type Student = {
  id: string;
  academy_id: string;
  student_code: string;
  name: string;
  parent_name: string;
  mobile: string;
  whatsapp: string | null;
  status: "active" | "inactive";
  sport_id: string | null;
  joining_date: string | null;
  qr_token: string | null;
  profile_photo_url: string | null;
  emergency_contact_name: string | null;
  emergency_contact_number: string | null;
  medical_notes: string | null;
  sports?: { name: string } | null;
};

export type Batch = {
  id: string;
  academy_id: string;
  name: string;
  sport_id: string | null;
  coach_id: string | null;
  capacity: number | null;
  start_time: string | null;
  end_time: string | null;
  days_of_week: number[] | null;
  is_active: boolean;
  sports?: { name: string } | null;
  coaches?: { name: string } | null;
};

export type StudentFee = {
  id: string;
  student_id: string;
  fee_type_id: string | null;
  fee_plan_id: string | null;
  assignment_id: string | null;
  period_label: string | null;
  amount: number;
  discount: number;
  paid_amount: number;
  pending_amount: number;
  due_date: string;
  status: FeeStatus;
  students?: Student | null;
  fee_types?: { name: string } | null;
  fee_plans?: FeePlan | null;
};

export type FeePlan = {
  id: string;
  academy_id: string;
  name: string;
  plan_type: FeePlanType;
  amount: number;
  billing_cycle_months: number | null;
  total_sessions: number | null;
  validity_days: number | null;
  due_day: number | null;
  sport_id: string | null;
  batch_id: string | null;
  fee_type_id: string | null;
  is_active: boolean;
  sports?: { name: string } | null;
  batches?: { name: string } | null;
};

export type StudentFeeAssignment = {
  id: string;
  student_id: string;
  fee_plan_id: string;
  start_date: string;
  end_date: string | null;
  status: AssignmentStatus;
  sessions_total: number | null;
  sessions_used: number;
  fee_plans?: FeePlan | null;
  students?: Student | null;
};

export type Lead = {
  id: string;
  name: string;
  parent_name: string | null;
  mobile: string;
  whatsapp: string | null;
  sport_interested: string | null;
  status: LeadStatus;
  trial_date: string | null;
  check_in_token: string | null;
  notes: string | null;
  created_at: string;
};
