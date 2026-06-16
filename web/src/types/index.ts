export type UserRole = "admin" | "staff" | "coach" | "owner";
export type FeeStatus = "pending" | "partially_paid" | "paid" | "overdue" | "cancelled";
export type AttendanceStatus = "present" | "absent" | "late";
export type LeadStatus =
  | "new_enquiry"
  | "contacted"
  | "trial_booked"
  | "trial_attended"
  | "follow_up_pending"
  | "converted"
  | "lost";

export type AcademyUser = {
  id: string;
  academy_id: string;
  user_id: string;
  role: UserRole;
  display_name: string | null;
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
  is_active: boolean;
  sports?: { name: string } | null;
  coaches?: { name: string } | null;
};

export type StudentFee = {
  id: string;
  student_id: string;
  fee_type_id: string;
  amount: number;
  discount: number;
  paid_amount: number;
  pending_amount: number;
  due_date: string;
  status: FeeStatus;
  students?: Student | null;
  fee_types?: { name: string } | null;
};
