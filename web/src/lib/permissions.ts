import type { AcademyPlan } from "@/lib/plans";
import type { UserRole } from "@/types";

export type AppModule =
  | "dashboard"
  | "students"
  | "attendance"
  | "fees"
  | "fee_plans"
  | "renewals"
  | "leads"
  | "batches"
  | "receipts"
  | "reports"
  | "settings"
  | "team"
  | "import"
  | "id_cards"
  | "audit"
  | "reminders"
  | "whatsapp";

const ROLE_ACCESS: Record<AppModule, UserRole[]> = {
  dashboard: ["admin", "staff", "coach", "owner"],
  students: ["admin", "staff", "coach", "owner"],
  attendance: ["admin", "staff", "coach", "owner"],
  fees: ["admin", "staff", "owner"],
  fee_plans: ["admin", "staff"],
  renewals: ["admin", "staff", "owner"],
  leads: ["admin", "staff", "owner"],
  batches: ["admin", "staff", "coach", "owner"],
  receipts: ["admin", "staff", "owner"],
  reports: ["admin", "staff", "owner"],
  settings: ["admin"],
  team: ["admin"],
  import: ["admin"],
  id_cards: ["admin", "staff"],
  audit: ["admin", "owner"],
  reminders: ["admin", "staff"],
  whatsapp: ["admin", "staff", "coach"],
};

export function canAccess(role: UserRole, module: AppModule) {
  return ROLE_ACCESS[module].includes(role);
}

export function canViewRenewals(role: UserRole) {
  return canAccess(role, "renewals");
}

export function canManageFeePlans(role: UserRole) {
  return role === "admin" || role === "staff";
}

export function canMutateFees(role: UserRole) {
  return role === "admin" || role === "staff";
}

export function canManageTeam(role: UserRole) {
  return role === "admin";
}

export function canExport(role: UserRole, plan: AcademyPlan) {
  return (role === "admin" || role === "owner") && plan === "pro";
}

export function navItemsForRole(role: UserRole) {
  const base = [
    { href: "/dashboard", label: "Dashboard", module: "dashboard" as const },
    { href: "/students", label: "Students", module: "students" as const },
    { href: "/attendance", label: "Attendance", module: "attendance" as const },
  ];
  const renewals = { href: "/renewals", label: "Renewals", module: "renewals" as const };
  const fees = { href: "/fees", label: "Fees", module: "fees" as const };
  const more = { href: "/more", label: "More", module: "dashboard" as const };

  if (role === "coach") return [...base, more];
  if (role === "owner") return [...base, renewals, more];
  if (role === "staff") return [...base, renewals, fees, more];
  return [...base, renewals, fees, more];
}
